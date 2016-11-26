
'use strict'
const tap = require('tap')
const objectFx = require('../index.js')

let flattened = null
// let expanded = null

/**
 * Array of objects
 */
const arrayOfObjects = [{ a: 1 }, { b: 2 }, { c: 3 }]

flattened = objectFx.flatten(arrayOfObjects)
tap.strictSame(flattened, {
  '0.a': 1,
  '1.b': 2,
  '2.c': 3
}, 'Flatten - Array of objects')
tap.strictSame(objectFx.expand(flattened), arrayOfObjects, 'Expand - Array of objects')

flattened = objectFx.flatten(arrayOfObjects, { ExplicitArrays: true })
tap.strictSame(flattened, {
  '[0].a': 1,
  '[1].b': 2,
  '[2].c': 3
}, 'Flatten - Array of objects (explicit arrays)')
tap.strictSame(objectFx.expand(flattened, { ExplicitArrays: true }), arrayOfObjects, 'Expand - Array of objects (explicit arrays)')
