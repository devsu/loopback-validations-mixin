# loopback-validations-mixin

Mixin for Loopback to easily configure validations from the model configuration file. It works with both Loopback 2 and 3.

## Installation

```bash
npm install --save loopback-validations-mixin
```

## Configuration

First, modify your `server/model-config.json` to include the path to this module:

```json
{
  "mixins": [
    "loopback/common/mixins",
    "loopback/server/mixins",
    "../common/mixins",
    "./mixins",
    "../node_modules/loopback-validations-mixin"
  ]
}
```

Then you use the mixin from your model definition files:

```json
...
"mixins": {
  "SetupValidations": {
    "validatesPresenceOf": [
      "name",
      { "propertyName": "address", "errMsg": { "message": "Error property cannot be blank" } }
    ]
  }
}
...
```

## Options

- All available methods in [Loopback Validate](https://apidocs.strongloop.com/loopback-datasource-juggler/#validatable)
- methodsFile (optional)
- source (optional)
- include (optional)

## Usage

You can define the validations directly in the model JSON configuration file, or in a JS file.

- [From JSON](#from-json)
- [From JS file](#from-js-file)

### From JSON

In the `model.json` file:

```json
...
"mixins": {
  "SetupValidations": {

    "validatesPresenceOf": [
      "name",
      {
        "propertyName": "lastName",
        "errMsg": { "message": "You should have a lastname" }
      }
    ],

    "validatesLengthOf": [{
      "propertyName": "name",
      "options": {
        "min": 10
      }
    }, {
      "propertyName": "address",
      "options": {
        "max": 10,
        "allowNull": true,
        "allowBlank": true,
        "message": { "max": "invalid size" }
      }
    }],

    "validatesAsync": [{
      "propertyName": "name",
      "validatorFn": "validatePropertyName",
      "options": {
        "message": "this is invalid"
      }
    }],
    "methodsFile": "./common/models/employee-validation-methods.js"
  }
}
...
```

As you can see, you can set an optional `methodsFile` option, to define the file that contains the methods needed by `validatesAsync` and `validates` options.

Do not forget to add `allowNull` and `allowBlank` if the property is optional. Otherwise [it will fail](https://github.com/strongloop/loopback-datasource-juggler/issues/541) when the parameter is not passed.

In the `employee-validation-methods.js` file:

```javascript
module.exports = {
  validatePropertyName
};

function validatePropertyName (err, done) {
  let data = this;
  if (data.name === 'Invalid') err();
  done();
}
```

### From JS File

You can use this variant when you need the properties to have some value calculated on runtime.

You can add all the validations defined on a file:

```json
...
"mixins": {
  "SetupValidations": {
    "source": "./common/models/employee-validations.js"
  }
}
...
```

Or just some of them:

```json
...
"mixins": {
  "SetupValidations": {
    "source": "./common/models/employee-validations.js",
    "include": [ "validatesPresenceOf" ]
  }
}
...
```

In the Javascript file (`employee-validations.js` in our example):

```javascript
const validatesPresenceOf = [
  'name',
  {
    'propertyName': 'lastName',
    'errMsg': {'message': 'Error property cant be blank'}
  }
];

const validatesLengthOf = [
  {
    'propertyName': 'name',
    'options': {'min': 6}
  },
  {
    'propertyName': 'address',
    'options': {
      'max': 10,
      'allowNull': true,
      'allowBlank': true,
      'message': {'max': 'Invalid size'},
    },
  },
];

const validatesAsync = [
  {
    'propertyName': 'name',
    'validatorFn': validatePropertyName,
    'options': {
      'message': 'error message',
      'allowNull': false,
    },
  },
];

function validatePropertyName(err, done) {
  let data = this;
  if (data.name === 'Invalid') err();
  done();
}

module.exports = {
  validatesPresenceOf,
  validatesLengthOf,
  validatesAsync,
};
```

As mentioned above, make sure you include the `allowNull` and `allowBlank` properties in the options of the non-required properties.
