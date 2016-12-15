'use strict';

function validatePropertyName(err, done) {
  if (this.propertyName === 'Invalid') err();
  done();
}

const validatesAbsenceOf = [
  'name',
  {'propertyName': 'address', 'errMsg': {'message': 'Error property cant be blank'}},
];

const validatesLengthOf = [
  {'propertyName': 'name', 'options': {'min': 100}},
  {'propertyName': 'address', 'options': {'max': 10, 'message': {'max': 'Invalid size'}}},
];

const validatesAsync = [{
  'propertyName': 'name',
  'validatorFn': 'validatePropertyName',
  'options': {'message': 'error message', 'allowNull': true}},
];

module.exports = {
  validatesAbsenceOf,
  validatesLengthOf,
  validatesAsync,
  validatePropertyName,
};
