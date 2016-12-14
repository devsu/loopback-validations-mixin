'use strict';

module.exports = {
  getModelMock,
};

function getModelMock() {
  let theModel = {
    modelName: 'MyModel',
    validatesAbsenceOf: jasmine.createSpy('validatesAbsenceOf'),
    validatesPresenceOf: jasmine.createSpy('validatesPresenceOf'),
    validatesLengthOf: jasmine.createSpy('validatesLengthOf'),
    validatesExclusionOf: jasmine.createSpy('validatesExclusionOf'),
    validatesInclusionOf: jasmine.createSpy('validatesInclusionOf'),
    validatesFormatOf: jasmine.createSpy('validatesFormatOf'),
    validatesNumericalityOf: jasmine.createSpy('validatesNumericalityOf'),
    validate: jasmine.createSpy('validate'),
    validateAsync: jasmine.createSpy('validateAsync'),
    validatesUniquenessOf: jasmine.createSpy('validatesUniquenessOf'),
    nullCheck: jasmine.createSpy('nullCheck'),
  };

  return theModel;
}
