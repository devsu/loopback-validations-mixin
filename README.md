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
    "validatesPresenceOf": [ "name", { "propertyName": "address", "message": "Error property cant be blank" } ],
    "source": "./common/models/validations-function.js" 
  }
}
...
```

## Options

- All available methods in [Loopback Validate](https://apidocs.strongloop.com/loopback-datasource-juggler/#validatable)
- asyncMethodsFile (optional)
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
    "validatesPresenceOf": [ "name", { "propertyName": "address", "message": "Error property cant be blank" } ],
    "validatesLengthOf": [
      { "propertyName": "name", "options": { "min": 100 } },
      { "propertyName": "address", "options": { "max": 10, "message": { "max": "invalid size" } } }
    ],
    "validatesAsync": [
      { "propertyName": "name", "method": "validatePropertyName", "message": "message" }
    ],
    "asyncMethodsFile": "./common/models/employee-async-validations.js"
  }
}
...
```

As you can see, you can set an optional `asyncMethodsFile` option, to define the file that contains the methods needed by the `validatesAsync` option. 

In the `employee-async-validations.js` file:

```javascript
module.exports = {
    validatePropertyName
};

function validatePropertyName (err, done) {
  if (this.propertyName === 'Invalid') err();
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
    "include": [ "validatesAbsenceOf" ]
  }
}
...
```

In the Javascript file (`employee-validations.js` in our example):

```javascript
module.exports = {
  validatesAbsenceOf,
  validatesLengthOf,
  validatesAsync,
};

function validatesAbsenceOf() {
  return [
    'propertyName', {'name': 'address', 'message': 'Error property cant be blank'},
  ];
}

function validatesLengthOf() {
  return [
    {'propertyName': 'name', 'options': {'min': 100}},
    {'propertyName': 'address', 'options': {'max': 10, 'message': {'max': 'Invalid size'}}},
  ];
}

function validatesAsync() {
  return [
    {'propertyName': 'name', 'function': 'validatePropertyName', 'message': 'message'},
  ];
}

function validatePropertyName(err, done) {
  if (this.propertyName === 'Invalid') err();
  done();
}
```
