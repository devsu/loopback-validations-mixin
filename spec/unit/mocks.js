'use strict';

module.exports = {
  getModelMock,
};

function getModelMock() {
  let theModel = {
    modelName: 'MyModel',
    observe: jasmine.createSpy('observe'),
    validatesAbsenceOf: jasmine.createSpy('validatesAbsenceOf'),
    validatesPresenceOf: jasmine.createSpy('validatesPresenceOf'),
    validatesLengthOf: jasmine.createSpy('validatesLengthOf'),
    validatesExclusionOf: jasmine.createSpy('validatesExclusionOf'),
    validatesInclusionOf: jasmine.createSpy('validatesInclusionOf'),
    validatesFormatOf: jasmine.createSpy('validatesFormatOf'),
    validatesNumericalityOf: jasmine.createSpy('validatesNumericalityOf'),
    validatesAsyncOf: jasmine.createSpy('validatesAsyncOf'),
    validatesUniquenessOf: jasmine.createSpy('validatesUniquenessOf'),
  };

  return theModel;
}