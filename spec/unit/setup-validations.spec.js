'use strict';

const mocks = require('./mocks');
const validations = require('./validations');
const setupValidations = require('../../setup-validations');
const path = require('path');

describe('setup validations', () => {
  let Model, options;

  beforeEach(() => {
    Model = mocks.getModelMock();
  });

  describe('setup validatesPresenceOf', () => {
    beforeAll(() => {
      options = {
        'validatesPresenceOf': [
          'name',
          {'propertyName': 'address', 'errMsg': {'message': 'Error property cant be blank'}},
        ],
      };
    });

    it('should call validatesPresenceOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesPresenceOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesPresenceOf).toHaveBeenCalledWith('name');
      expect(Model.validatesPresenceOf)
          .toHaveBeenCalledWith('address', {'message': 'Error property cant be blank'});
    });
  });

  describe('setup validatesAbsenceOf', () => {
    beforeAll(() => {
      options = {
        'validatesAbsenceOf': [
          'name',
          {'propertyName': 'address', 'errMsg': {'message': 'Error property cant be blank'}},
        ],
      };
    });

    it('should call validatesAbsenceOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesAbsenceOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesAbsenceOf).toHaveBeenCalledWith('name');
      expect(Model.validatesAbsenceOf)
          .toHaveBeenCalledWith('address', {'message': 'Error property cant be blank'});
    });
  });

  describe('setup validatesLengthOf', () => {
    beforeAll(() => {
      options = {
        'validatesLengthOf': [
          {'propertyName': 'name', 'options': {'min': 100}},
          {'propertyName': 'address', 'options': {'max': 10, 'message': {'max': 'invalid size'}}},
        ],
      };
    });

    it('should call validatesLengthOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesLengthOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesLengthOf).toHaveBeenCalledWith('name', {'min': 100});
      expect(Model.validatesLengthOf).toHaveBeenCalledWith('address',
          {'max': 10, 'message': {'max': 'invalid size'}});
    });
  });

  describe('setup validatesExclusionOf', () => {
    beforeAll(() => {
      options = {
        'validatesExclusionOf': [
          {'propertyName': 'name', 'options': {'in': ['www', 'domain']}},
          {'propertyName': 'address', 'options':
              {'in': ['www', 'domain'], 'message': 'error message', 'allowNull': true}},
        ],
      };
    });

    it('should call validatesExclusionOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesExclusionOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesExclusionOf).toHaveBeenCalledWith('name', {'in': ['www', 'domain']});
      expect(Model.validatesExclusionOf).toHaveBeenCalledWith('address',
          {'in': ['www', 'domain'], 'message': 'error message', 'allowNull': true});
    });
  });

  describe('setup validatesInclusionOf', () => {
    beforeAll(() => {
      options = {
        'validatesInclusionOf': [
          {'propertyName': 'name', 'options': {'in': ['www', 'domain']}},
          {'propertyName': 'address', 'options':
              {'in': ['www', 'domain'], 'message': 'error message', 'allowNull': true}},
        ],
      };
    });

    it('should call validatesInclusionOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesInclusionOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesInclusionOf).toHaveBeenCalledWith('name', {'in': ['www', 'domain']});
      expect(Model.validatesInclusionOf).toHaveBeenCalledWith('address',
          {'in': ['www', 'domain'], 'message': 'error message', 'allowNull': true});
    });
  });

  describe('setup validatesFormatOf', () => {
    beforeAll(() => {
      options = {
        'validatesFormatOf': [
          {'propertyName': 'name', 'options': {'with': /\w+/}},
          {'propertyName': 'address', 'options':
              {'with': /\w+/, 'message': 'message', 'allowNull': true}},
        ],
      };
    });

    it('should call validatesFormatOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesFormatOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesFormatOf).toHaveBeenCalledWith('name', {'with': /\w+/});
      expect(Model.validatesFormatOf).toHaveBeenCalledWith('address',
          {'with': /\w+/, 'message': 'message', 'allowNull': true});
    });
  });

  describe('setup validatesNumericalityOf', () => {
    beforeAll(() => {
      options = {
        'validatesNumericalityOf': [
          {'propertyName': 'name', 'options': {'int': true}},
          {'propertyName': 'address', 'options':
              {'int': true, 'message': 'error message'}},
        ],
      };
    });

    it('should call validatesNumericalityOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesNumericalityOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesNumericalityOf).toHaveBeenCalledWith('name', {'int': true});
      expect(Model.validatesNumericalityOf).toHaveBeenCalledWith('address',
          {'int': true, 'message': 'error message'});
    });
  });

  describe('setup validatesUniquenessOf', () => {
    beforeAll(() => {
      options = {
        'validatesUniquenessOf': [
          {'propertyName': 'name', 'options': {'scopedTo': ['userId', 'email']}},
          {'propertyName': 'address', 'options':
            {'scopedTo': ['userId', 'email'], 'message': 'message', 'allowNull': true}},
          {'propertyName': 'phone', 'options':
            {'with': /\w+/, 'message': 'message', 'allowNull': false}},
        ],
      };
    });

    it('should call validatesUniquenessOf method', () => {
      setupValidations(Model, options);
      expect(Model.validatesUniquenessOf).toHaveBeenCalledTimes(3);
      expect(Model.validatesUniquenessOf).toHaveBeenCalledWith('name',
          {'scopedTo': ['userId', 'email']});
      expect(Model.validatesUniquenessOf).toHaveBeenCalledWith('address',
          {'scopedTo': ['userId', 'email'], 'message': 'message', 'allowNull': true});
      expect(Model.validatesUniquenessOf).toHaveBeenCalledWith('phone',
          {'with': /\w+/, 'message': 'message', 'allowNull': false});
    });
  });

  describe('setup validatesAsync', () => {
    beforeAll(() => {
      options = {
        'validatesAsync': [{
          'propertyName': 'name',
          'validatorFn': 'validatorName',
          'options': {'message': 'error message', 'allowNull': true}},
        ],
        'methodsFile': './common/models/employee-async-validations.js',
      };
    });

    describe('when methodsFile is defined', () => {
      it('should call validateAsync method', () => {
        setupValidations(Model, options);
        expect(Model.validateAsync).toHaveBeenCalledTimes(1);
        expect(Model.validateAsync).toHaveBeenCalledWith('name', 'validatorName',
            {'message': 'error message', 'allowNull': true});
      });
    });

    describe('when methodsFile is NOT defined', () => {
      beforeAll(() => {
        delete options.methodsFile;
      });

      it('should throw error methodsFile is not defined', () => {
        expect(() => {
          setupValidations(Model, options);
        }).toThrowError('methodsFile is not defined');
      });
    });
  });

  describe('setup validates', () => {
    beforeAll(() => {
      options = {
        'validates': [{
          'propertyName': 'name',
          'validatorFn': 'validatorName',
          'options': {'message': 'error message', 'allowNull': true}},
        ],
        'methodsFile': './common/models/employee-validations.js',
      };
    });

    describe('when methodsFile is defined', () => {
      it('should call validate method', () => {
        setupValidations(Model, options);
        expect(Model.validate).toHaveBeenCalledTimes(1);
        expect(Model.validate).toHaveBeenCalledWith('name', 'validatorName',
            {'message': 'error message', 'allowNull': true});
      });
    });

    describe('when methodsFile is NOT defined', () => {
      beforeAll(() => {
        delete options.methodsFile;
      });

      it('should throw error methodsFile is not defined', () => {
        expect(() => {
          setupValidations(Model, options);
        }).toThrowError('methodsFile is not defined');
      });
    });
  });

  describe('setup nullCheck', () => {
    beforeAll(() => {
      options = {
        'nullCheck': [{
          'attr': 'name',
          'conf': {'allowBlank': true},
        }, {
          'attr': 'address',
          'conf': {'allowBlank': false},
          'err': 'errorFn',
        }],
      };
    });

    it('should call nullCheck method', () => {
      setupValidations(Model, options);
      expect(Model.nullCheck).toHaveBeenCalledTimes(2);
      expect(Model.nullCheck).toHaveBeenCalledWith('name', {'allowBlank': true});
      expect(Model.nullCheck).toHaveBeenCalledWith('address', {'allowBlank': false}, 'errorFn');
    });
  });

  describe('when source option is defined', () => {
    let originalCWD;

    beforeAll(() => {
      // Modifying process.cwd, to test that it will be taken into account to get the source file
      originalCWD = process.cwd;
      process.cwd = () => {
        return path.join(originalCWD(), 'spec');
      };
    });

    afterAll(() => {
      // reverting the change we made
      process.cwd = originalCWD;
    });

    beforeEach(() => {
      options.source = './unit/validations.js';
    });

    it('Should add the hooks in the model using the methods in the file', () => {
      setupValidations(Model, options);
      expect(Model.validatesAbsenceOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesAbsenceOf).toHaveBeenCalledWith('name');
      expect(Model.validatesAbsenceOf).toHaveBeenCalledWith('address',
          {'message': 'Error property cant be blank'});
      expect(Model.validatesAbsenceOf).toHaveBeenCalledTimes(2);
      expect(Model.validatesLengthOf).toHaveBeenCalledWith('name', {'min': 100});
      expect(Model.validatesLengthOf).toHaveBeenCalledWith('address',
          {'max': 10, 'message': {'max': 'Invalid size'}});
      expect(Model.validateAsync).toHaveBeenCalledTimes(1);
      expect(Model.validateAsync).toHaveBeenCalledWith('name', 'validatorName',
          {'message': 'error message', 'allowNull': true});
    });
  });
});
