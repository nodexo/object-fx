
const tap = require('tap')
const objectFx = require('../index.js')

/**
  == Primitive Data Types ==
  NaN of two different object can't be compared,
  because it could be anything except a number.
  So the comparison has to be isNaN(NaN)!
*/

const primitiveDataTypes = {
  String: '"Hello World!"',
  'Number(0)': 0,
  'Number(-0)': -0,
  'Number(123)': 123,
  'Number(-123.456)': -123.456,
  'Number(Infinity)': Infinity,
  'Number(-Infinity)': -Infinity,
  'Number(NaN)': isNaN(NaN),
  'Boolean(true)': true,
  'Boolean(false)': false,
  Symbol: Symbol(),
  Null: null,
  Undefined: undefined
}

// Flatten
for (let key of Object.keys(primitiveDataTypes)) {
  const objExp = { nested: { key: primitiveDataTypes[key] } }
  const objFlat = { 'nested.key': primitiveDataTypes[key] }
  tap.strictSame(objectFx.flatten(objExp), objFlat, `Flatten primitive "${key}"`)
}

// Expand/Unflatten
for (let key of Object.keys(primitiveDataTypes)) {
  const objExp = { nested: { key: primitiveDataTypes[key] } }
  const objFlat = { 'nested.key': primitiveDataTypes[key] }
  tap.strictSame(objectFx.expand(objFlat), objExp, `Expand primitive "${key}"`)
}

/**
  == Object Data Types ==
*/
let myMap = new Map()
myMap.set(1, 'one')
myMap.set(2, 'two')

let mySet = new Set()
mySet.add(1)
mySet.add(3)
mySet.add('A string.')

let buffer = new ArrayBuffer(64)

const objectDataTypes = {
  Date: new Date(0),
  RegExp: /RegExp/ig,
  Map: myMap,
  Set: mySet,
  Uint8View: new Uint8Array(buffer),
  Uint8ClampedView: new Uint8ClampedArray(buffer),
  Int16View: new Int16Array(buffer),
  Uint16View: new Uint16Array(buffer),
  Int32View: new Int32Array(buffer),
  Uint32View: new Uint32Array(buffer),
  Float32View: new Float32Array(buffer),
  Float64View: new Float64Array(buffer),
  Function: function () { return 'This is a function.' },
  Array: ['This', 'is', 1, 'array.'],
  Object: {
    'What?': 'This is an object.'
  }
}

const flattenedObjects = {
  Array: {
    'nested.key.0': 'This',
    'nested.key.1': 'is',
    'nested.key.2': 1,
    'nested.key.3': 'array.'
  },
  Object: {
    'nested.key.What?': 'This is an object.'
  }
}

// Flatten
for (let key of Object.keys(objectDataTypes)) {
  const objExp = { nested: { key: objectDataTypes[key] } }
  const objFlat = (flattenedObjects[key] ? flattenedObjects[key] : { 'nested.key': objectDataTypes[key] })
  tap.strictSame(objectFx.flatten(objExp), objFlat, `Flatten object "${key}"`)
}

// Expand/Unflatten
for (let key of Object.keys(objectDataTypes)) {
  const objExp = { nested: { key: objectDataTypes[key] } }
  const objFlat = { 'nested.key': objectDataTypes[key] }
  tap.strictSame(objectFx.expand(objFlat), objExp, `Expand object "${key}"`)
}
