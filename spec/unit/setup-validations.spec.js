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
        'validatesPresenceOf': ['name',
          {'propertyName': 'address', 'message': 'Error property cant be blank'}],
      };
    });

    it('should call validatesPresenceOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesPresenceOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesPresenceOf', 'address');
    });
  });

  describe('setup validatesAbsenceOf', () => {
    beforeAll(() => {
      options = {
        'validatesAbsenceOf': ['name',
          {'propertyName': 'address', 'message': 'Error property cant be blank'}],
      };
    });

    it('should call validatesAbsenceOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesAbsenceOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesAbsenceOf', 'address');
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
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesLengthOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesLengthOf', 'address');
    });
  });

  describe('setup validatesExclusionOf', () => {
    beforeAll(() => {
      options = {
        'validatesExclusionOf': [
          {'propertyName': 'name', 'options': {'in': ['www', 'domain']}},
          {'propertyName': 'address', 'options': {
            'in': ['www', 'domain'], 'message': 'message', 'allowNull': true,
          }},
        ],
      };
    });

    it('should call validatesExclusionOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesExclusionOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesExclusionOf', 'address');
    });
  });

  describe('setup validatesInclusionOf', () => {
    beforeAll(() => {
      options = {
        'validatesInclusionOf': [
          {'propertyName': 'name', 'options': {'in': ['www', 'domain']}},
          {'propertyName': 'address', 'options': {
            'in': ['www', 'domain'], 'message': 'message', 'allowNull': true,
          }},
        ],
      };
    });

    it('should call validatesInclusionOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesInclusionOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesInclusionOf', 'address');
    });
  });

  describe('setup validatesFormatOf', () => {
    beforeAll(() => {
      options = {
        'validatesFormatOf': [
          {'propertyName': 'name', 'options': {'with': /\w+/}},
          {'propertyName': 'address', 'options': {
            'with': /\w+/, 'message': 'message', 'allowNull': true,
          }},
        ],
      };
    });

    it('should call validatesFormatOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesFormatOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesFormatOf', 'address');
    });
  });

  describe('setup validatesNumericalityOf', () => {
    beforeAll(() => {
      options = {
        'validatesNumericalityOf': [
          {'propertyName': 'name', 'options': {'int': true}},
          {'propertyName': 'address', 'options': {
            'int': true, 'message': 'message'},
          },
        ],
      };
    });

    it('should call validatesNumericalityOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(2);
      expect(Model.observe).toHaveBeenCalledWith('validatesNumericalityOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesNumericalityOf', 'address');
    });
  });

  describe('setup validatesUniquenessOf', () => {
    beforeAll(() => {
      options = {
        'validatesUniquenessOf': [
          {'propertyName': 'name', 'options': {'scopedTo': ['userId', 'email']}},
          {'propertyName': 'address', 'options': {
            'scopedTo': ['userId', 'email'], 'message': 'message', 'allowNull': true,
          }},
          {'propertyName': 'phone', 'options': {
            'with': /\w+/, 'message': 'message', 'allowNull': false,
          }},
        ],
      };
    });

    it('should call validatesUniquenessOf method', () => {
      setupValidations(Model, options);
      expect(Model.observe).toHaveBeenCalledTimes(3);
      expect(Model.observe).toHaveBeenCalledWith('validatesUniquenessOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesUniquenessOf', 'address');
      expect(Model.observe).toHaveBeenCalledWith('validatesUniquenessOf', 'phone');
    });
  });

  describe('setup validatesAsync', () => {
    beforeAll(() => {
      options = {
        'validatesAsync': [
          {'propertyName': 'name', 'method': 'validatePropertyName', 'message': 'message'},
        ],
        'asyncMethodsFile': './common/models/employee-async-validations.js',
      };
    });

    describe('when asyncMethodsFile is defined', () => {
      it('should call validatesAsync method', () => {
        setupValidations(Model, options);
        expect(Model.observe).toHaveBeenCalledTimes(1);
        expect(Model.observe).toHaveBeenCalledWith('validatesAsync', 'name');
      });
    });

    describe('when asyncMethodsFile is NOT defined', () => {
      beforeAll(() => {
        delete options.asyncMethodsFile;
      });

      it('should throw error asyncMethodsFile is not defined', () => {
        expect(() => {
          setupValidations(Model, options);
        }).toThrowError('asyncMethodsFile is not defined');
      });
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
      expect(Model.observe).toHaveBeenCalledTimes(5);
      expect(Model.observe).toHaveBeenCalledWith('validatesAbsenceOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesAbsenceOf', 'address');
      expect(Model.observe).toHaveBeenCalledWith('validatesLengthOf', 'name');
      expect(Model.observe).toHaveBeenCalledWith('validatesLengthOf', 'address');
      expect(Model.observe).toHaveBeenCalledWith('validatesAsync', 'name');
    });
  });
});
