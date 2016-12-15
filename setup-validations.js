'use strict';

const _ = require('lodash');
const path = require('path');
const debug = require('debug')('loopback:contrib:setup-validations-mixin');

class SetupValidations {
  constructor(Model, options) {
    this.Model = Model;
    this.options = options;
    this.source = options.source;
    this.methodsFile = options.methodsFile;
  }

  execute() {
    let model = this.Model;
    let opt = this.options;
    if (this.source) {
      opt = require(path.join(process.cwd(), this.source));
    }

    this.validateMethodsFile(opt.validates);
    this.validateMethodsFile(opt.validatesAsync);
    this.setupValidation(model.validatesLengthOf, opt.validatesLengthOf);
    this.setupValidation(model.validatesExclusionOf, opt.validatesExclusionOf);
    this.setupValidation(model.validatesInclusionOf, opt.validatesInclusionOf);
    this.setupValidation(model.validatesFormatOf, opt.validatesFormatOf);
    this.setupValidation(model.validatesNumericalityOf, opt.validatesNumericalityOf);
    this.setupValidation(model.validatesUniquenessOf, opt.validatesUniquenessOf);
    this.setupAbsencePresenceValidations(model.validatesAbsenceOf, opt.validatesAbsenceOf);
    this.setupAbsencePresenceValidations(model.validatesPresenceOf, opt.validatesPresenceOf);
    this.setupValidationWithFiles(model.validate, opt.validates);
    this.setupValidationWithFiles(model.validateAsync, opt.validatesAsync);
    this.setupValidateNullCheck(opt.nullCheck);
  }

  validateMethodsFile(validations) {
    validations = validations || [];
    if (validations.length > 0 && !this.methodsFile && !this.source) {
      throw new Error('methodsFile is not defined');
    }
  }

  setupValidateNullCheck(validations) {
    validations = validations || [];
    validations.forEach((validation) => {
      if (validation.err) {
        this.Model.nullCheck(validation.attr, validation.conf, validation.err);
        return;
      }
      this.Model.nullCheck(validation.attr, validation.conf);
    });
  }

  setupValidationWithFiles(validationMethod, validations) {
    let source = this.methodsFile || this.source;
    validations = validations || [];
    if (!source || validations.length === 0) {
      return;
    }
    const methods = require(path.join(process.cwd(), source));
    validations.forEach((validate) => {
      let method = this.getMethod(validate.validatorFn, methods);
      validationMethod.apply(this.Model, [validate.propertyName, method,
        validate.options]);
    });
  }

  setupAbsencePresenceValidations(validationMethod, validations) {
    validations = validations || [];
    validations.forEach((validation) => {
      if (validation.errMsg) {
        validationMethod.apply(this.Model, [this.getPropertyName(validation), validation.errMsg]);
        return;
      }
      validationMethod.apply(this.Model, [this.getPropertyName(validation)]);
    });
  }

  setupValidation(validationMethod, validations) {
    validations = validations || [];
    validations.forEach((validation) => {
      validationMethod.apply(this.Model, [validation.propertyName, validation.options]);
    });
  }

  getPropertyName(validation) {
    return validation.propertyName || validation;
  }

  getMethod(validatorFn, methods) {
    let method = validatorFn;
    if (!_.isFunction(method)) {
      method = methods[method];
    }
    return method;
  }
}

module.exports = (Model, options) => {
  const setupValidations = new SetupValidations(Model, options);
  setupValidations.execute();
};
