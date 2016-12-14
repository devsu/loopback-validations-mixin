'use strict';

const _ = require('lodash');
const path = require('path');
const debug = require('debug')('loopback:contrib:setup-validations-mixin');

module.exports = (Model, options) => {
  let source = options['source'];
  if (source) {
    options = require(path.join(process.cwd(), options.source));
  }

  let validatesPresenceOf = options['validatesPresenceOf'] || [];
  let validatesAbsenceOf = options['validatesAbsenceOf'] || [];
  let validatesLengthOf = options['validatesLengthOf'] || [];
  let validates = options['validates'] || [];
  let validatesAsync = options['validatesAsync'] || [];
  let validatesExclusionOf = options['validatesExclusionOf'] || [];
  let validatesInclusionOf = options['validatesInclusionOf'] || [];
  let validatesFormatOf = options['validatesFormatOf'] || [];
  let validatesNumericalityOf = options['validatesNumericalityOf'] || [];
  let validatesUniquenessOf = options['validatesUniquenessOf'] || [];
  let nullCheck = options['nullCheck'] || [];
  let methodsFile = options['methodsFile'];

  if (validatesAsync.length > 0 && !methodsFile && !source) {
    throw new Error('methodsFile is not defined');
  }

  if (validates.length > 0 && !methodsFile && !source) {
    throw new Error('methodsFile is not defined');
  }

  validatesPresenceOf.forEach((validatePresenceOf) => {
    if (hasErrMsg(validatePresenceOf)) {
      Model.validatesPresenceOf(getPropertyName(validatePresenceOf), validatePresenceOf.errMsg);
      return;
    }
    Model.validatesPresenceOf(getPropertyName(validatePresenceOf));
  });

  validatesAbsenceOf.forEach((validateAbsenceOf) => {
    if (hasErrMsg(validateAbsenceOf)) {
      Model.validatesAbsenceOf(getPropertyName(validateAbsenceOf), validateAbsenceOf.errMsg);
      return;
    }
    Model.validatesAbsenceOf(getPropertyName(validateAbsenceOf));
  });

  validatesLengthOf.forEach((validateLengthOf) => {
    Model.validatesLengthOf(validateLengthOf.propertyName, validateLengthOf.options);
  });

  validatesExclusionOf.forEach((validateExclusionOf) => {
    Model.validatesExclusionOf(validateExclusionOf.propertyName, validateExclusionOf.options);
  });

  validatesInclusionOf.forEach((validateInclusionOf) => {
    Model.validatesInclusionOf(validateInclusionOf.propertyName, validateInclusionOf.options);
  });

  validatesFormatOf.forEach((validateFormatOf) => {
    Model.validatesFormatOf(validateFormatOf.propertyName, validateFormatOf.options);
  });

  validatesNumericalityOf.forEach((validateNumericalityOf) => {
    Model.validatesNumericalityOf(validateNumericalityOf.propertyName,
        validateNumericalityOf.options);
  });

  validatesUniquenessOf.forEach((validateUniquenessOf) => {
    Model.validatesUniquenessOf(validateUniquenessOf.propertyName,
        validateUniquenessOf.options);
  });

  nullCheck.forEach((nullCheck) => {
    if (nullCheck.err) {
      Model.nullCheck(nullCheck.attr, nullCheck.conf, nullCheck.err);
      return;
    }
    Model.nullCheck(nullCheck.attr, nullCheck.conf);
  });

  if (methodsFile || (source && validatesAsync.length > 0)) {
    validatesAsync.forEach((validateAsync) => {
      Model.validateAsync(validateAsync.propertyName, validateAsync.validatorFn,
          validateAsync.options);
    });
  }

  if (methodsFile || (source && validates.length > 0)) {
    validates.forEach((validate) => {
      Model.validate(validate.propertyName, validate.validatorFn,
        validate.options);
    });
  }

  function getPropertyName(validate) {
    if (validate.propertyName) {
      return validate.propertyName;
    }
    return validate;
  }

  function hasErrMsg(validate) {
    if (validate.errMsg) {
      return true;
    }
    return false;
  }
};
