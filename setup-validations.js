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
  let validatesAsync = options['validatesAsync'] || [];
  let validatesExclusionOf = options['validatesExclusionOf'] || [];
  let validatesInclusionOf = options['validatesInclusionOf'] || [];
  let validatesFormatOf = options['validatesFormatOf'] || [];
  let validatesNumericalityOf = options['validatesNumericalityOf'] || [];
  let validatesUniquenessOf = options['validatesUniquenessOf'] || [];
  let asyncMethodsFile = options['asyncMethodsFile'];

  if (validatesAsync.length > 0 && !asyncMethodsFile && !source) {
    throw new Error('asyncMethodsFile is not defined');
  }

  validatesPresenceOf.forEach((validatesPresenceOf) => {
    Model.observe('validatesPresenceOf', validatesPresenceOf.propertyName || validatesPresenceOf);
  });

  validatesAbsenceOf.forEach((validatesAbsenceOf) => {
    Model.observe('validatesAbsenceOf', validatesAbsenceOf.propertyName || validatesAbsenceOf);
  });

  validatesLengthOf.forEach((validatesLengthOf) => {
    Model.observe('validatesLengthOf', validatesLengthOf.propertyName);
  });

  validatesExclusionOf.forEach((validatesExclusionOf) => {
    Model.observe('validatesExclusionOf', validatesExclusionOf.propertyName);
  });

  validatesInclusionOf.forEach((validatesInclusionOf) => {
    Model.observe('validatesInclusionOf', validatesInclusionOf.propertyName);
  });

  validatesFormatOf.forEach((validatesFormatOf) => {
    Model.observe('validatesFormatOf', validatesFormatOf.propertyName);
  });

  validatesNumericalityOf.forEach((validatesNumericalityOf) => {
    Model.observe('validatesNumericalityOf', validatesNumericalityOf.propertyName);
  });

  validatesUniquenessOf.forEach((validatesUniquenessOf) => {
    Model.observe('validatesUniquenessOf', validatesUniquenessOf.propertyName);
  });

  if (asyncMethodsFile || (source && validatesAsync.length > 0)) {
    validatesAsync.forEach((validatesAsync) => {
      Model.observe('validatesAsync', validatesAsync.propertyName);
    });
  }

  function setupValidations(setupValidations, opt) {

  }
};
