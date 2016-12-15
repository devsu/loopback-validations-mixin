'use strict';

module.exports = {
  validatePropertyName,
};

function validatePropertyName(err, done) {
  if (this.propertyName === 'Invalid') err();
  done();
}
