'use strict';

const _ = require('lodash');
const path = require('path');

class SetupValidations {
  constructor(Model, options) {
    this.Model = Model;
    this.options = options;
    this.source = options.source;
    this.methodsFile = options.methodsFile;
    this.include = options.include;
  }

  execute() {
    let opt = this.options;
    if (this.source) {
      opt = require(path.join(process.cwd(), this.source));
    }

    if (opt.validates || opt.validatesAsync) {
      this.validateMethodsFile();
    }
    this.setupValidation('validatesLengthOf', opt.validatesLengthOf);
    this.setupValidation('validatesExclusionOf', opt.validatesExclusionOf);
    this.setupValidation('validatesInclusionOf', opt.validatesInclusionOf);
    this.setupValidation('validatesFormatOf', opt.validatesFormatOf);
    this.setupValidation('validatesNumericalityOf', opt.validatesNumericalityOf);
    this.setupValidation('validatesUniquenessOf', opt.validatesUniquenessOf);
    this.setupAbsencePresenceValidations('validatesAbsenceOf', opt.validatesAbsenceOf);
    this.setupAbsencePresenceValidations('validatesPresenceOf', opt.validatesPresenceOf);
    this.setupValidationWithFiles('validate', opt.validates);
    this.setupValidationWithFiles('validateAsync', opt.validatesAsync);
  }

  validateMethodsFile() {
    if (!this.methodsFile && !this.source) {
      throw new Error('methodsFile is not defined');
    }
  }

  setupValidationWithFiles(validationMethodName, validations) {
    if (!this.shouldIncludeValidation(validationMethodName)) {
      return;
    }
    let validationMethod = this.Model[validationMethodName];
    let source = this.methodsFile || this.source;
    validations = validations || [];
    if (!source || validations.length === 0) {
      return;
    }
    const methods = require(path.join(process.cwd(), source));

    validations.forEach((validation) => {
      let method = this.getMethod(validation.validatorFn, methods);
      validationMethod.apply(this.Model, [validation.propertyName, method,
        validation.options]);
    });
  }

  setupAbsencePresenceValidations(validationMethodName, validations) {
    if (!this.shouldIncludeValidation(validationMethodName)) {
      return;
    }
    validations = validations || [];
    let validationMethod = this.Model[validationMethodName];
    validations.forEach((validation) => {
      if (validation.errMsg) {
        validationMethod.apply(this.Model, [this.getPropertyName(validation), validation.errMsg]);
        return;
      }
      validationMethod.apply(this.Model, [this.getPropertyName(validation)]);
    });
  }

  setupValidation(validationMethodName, validations) {
    if (!this.shouldIncludeValidation(validationMethodName)) {
      return;
    }
    validations = validations || [];
    let validationMethod = this.Model[validationMethodName];
    validations.forEach((validation) => {
      validationMethod.apply(this.Model, [validation.propertyName, validation.options]);
    });
  }

  shouldIncludeValidation(validationMethodName) {
    return !this.include || (this.include && _.includes(this.include, validationMethodName));
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
