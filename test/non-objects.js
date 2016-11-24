
const tap = require('tap')
const objectFx = require('../index.js')

// Flatten
tap.strictSame(objectFx.flatten(undefined), null, `Flatten 'undefined'`)
tap.strictSame(objectFx.flatten(null), null, `Flatten 'null'`)

// Expand/Unflatten
tap.strictSame(objectFx.expand(undefined), null, `Expand 'undefined'`)
tap.strictSame(objectFx.expand(null), null, `Expand 'null'`)
