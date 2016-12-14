'use strict';

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
  'validatorFn': 'validatorName',
  'options': {'message': 'error message', 'allowNull': true}},
];

function validatePropertyName(err, done) {
  if (this.propertyName === 'Invalid') err();
  done();
}

module.exports = {
  validatesAbsenceOf,
  validatesLengthOf,
  validatesAsync,
};
