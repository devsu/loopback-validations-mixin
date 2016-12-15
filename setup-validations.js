'use strict';

const _ = require('lodash');
const path = require('path');
const debug = require('debug')('loopback:contrib:setup-validations-mixin');

module.exports = (Model, options) => {
  let source = options.source;
  if (source) {
    options = require(path.join(process.cwd(), source));
  }

  let methodsFile = options.methodsFile;
  validateMethodsFile(options.validates, methodsFile, source);
  validateMethodsFile(options.validatesAsync, methodsFile, source);
  setupValidations();

  function setupValidations() {
    setupValidation(Model.validatesLengthOf, options.validatesLengthOf);
    setupValidation(Model.validatesExclusionOf, options.validatesExclusionOf);
    setupValidation(Model.validatesInclusionOf, options.validatesInclusionOf);
    setupValidation(Model.validatesFormatOf, options.validatesFormatOf);
    setupValidation(Model.validatesNumericalityOf, options.validatesNumericalityOf);
    setupValidation(Model.validatesUniquenessOf, options.validatesUniquenessOf);
    setupAbsencePresenceValidations(Model.validatesAbsenceOf, options.validatesAbsenceOf);
    setupAbsencePresenceValidations(Model.validatesPresenceOf, options.validatesPresenceOf);
    setupValidationWithFiles(Model.validate, options.validates, methodsFile || source);
    setupValidationWithFiles(Model.validateAsync, options.validatesAsync, methodsFile || source);
    setupValidateNullCheck(options.nullCheck);
  }

  function validateMethodsFile(validations, methodsFile, source) {
    validations = validations || [];
    if (validations.length > 0 && !methodsFile && !source) {
      throw new Error('methodsFile is not defined');
    }
  }

  function setupValidateNullCheck(validations) {
    validations = validations || [];
    validations.forEach((validation) => {
      if (validation.err) {
        Model.nullCheck(validation.attr, validation.conf, validation.err);
        return;
      }
      Model.nullCheck(validation.attr, validation.conf);
    });
  }

  function setupValidationWithFiles(validationMethod, validations, source) {
    validations = validations || [];
    if (!source || validations.length === 0) {
      return;
    }
    const methods = require(path.join(process.cwd(), source));
    validations.forEach((validate) => {
      var method = getMethod(validate.validatorFn, methods);
      validationMethod.apply(Model, [validate.propertyName, method,
        validate.options]);
    });
  }

  function setupAbsencePresenceValidations(validationMethod, validations) {
    validations = validations || [];
    validations.forEach((validation) => {
      if (validation.errMsg) {
        validationMethod.apply(Model, [getPropertyName(validation), validation.errMsg]);
        return;
      }
      validationMethod.apply(Model, [getPropertyName(validation)]);
    });
  }

  function setupValidation(validationMethod, validations) {
    validations = validations || [];
    validations.forEach((validation) => {
      validationMethod.apply(Model, [validation.propertyName, validation.options]);
    });
  }

  function getPropertyName(validation) {
    return validation.propertyName || validation;
  }

  function getMethod(validatorFn, methods) {
    let method = validatorFn;
    if (!_.isFunction(method)) {
      method = methods[method];
    }
    return method;
  }
};
