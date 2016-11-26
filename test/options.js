
'use strict'
const tap = require('tap')
const objectFx = require('../index.js')

/**
 * Objects
*/
const nestedObject = {
  lets: {
    count: [1, 2, 3, '...']
  },
  Is: {
    this: {
      deeply: {
        nested: {
          '?': 'YEES!!!'
        }
      }
    }
  }
}

const circularReference = { prop: this }
circularReference.prop = circularReference

const circularArrays = { prop_a: [], prop_b: [] }
circularArrays.prop_a[0] = circularArrays.prop_b
circularArrays.prop_b[0] = circularArrays.prop_a

let flattened = null
let expanded = null

/**
 * AutocreateArrays
*/
flattened = objectFx.flatten(nestedObject)
tap.strictSame(objectFx.expand(flattened, { AutocreateArrays: false }), {
  lets: {
    count: {
      0: 1,
      1: 2,
      2: 3,
      3: '...'
    }
  },
  Is: {
    this: {
      deeply: {
        nested: {
          '?': 'YEES!!!'
        }
      }
    }
  }
}, 'Expand - AutocreateArrays: false')

/**
 * CircularityCheck
*/
tap.throws(function () { objectFx.flatten(circularReference) }, {}, 'Throw error: circular reference without testing')
tap.strictSame(objectFx.flatten(circularReference, { CircularityCheck: true }), null, 'CircularityCheck (circular reference)')

tap.throws(function () { objectFx.flatten(circularArrays) }, {}, 'Throw error: circular arrays without testing')
tap.strictSame(objectFx.flatten(circularArrays, { CircularityCheck: true }), null, 'CircularityCheck (circular arrays)')

/**
 * CustomDelimiter
*/
flattened = objectFx.flatten(nestedObject, { CustomDelimiter: '_' })
tap.strictSame(flattened, {
  lets_count_0: 1,
  lets_count_1: 2,
  lets_count_2: 3,
  lets_count_3: '...',
  'Is_this_deeply_nested_?': 'YEES!!!'
}, 'Flatten - CustomDelimiter (single char)')

expanded = objectFx.expand(flattened, { CustomDelimiter: '_' })
tap.strictSame(expanded, nestedObject, 'Expand - CustomDelimiter (single char)')

flattened = objectFx.flatten(nestedObject, { CustomDelimiter: '|#|' })
tap.strictSame(flattened, {
  'lets|#|count|#|0': 1,
  'lets|#|count|#|1': 2,
  'lets|#|count|#|2': 3,
  'lets|#|count|#|3': '...',
  'Is|#|this|#|deeply|#|nested|#|?': 'YEES!!!'
}, 'Flatten - CustomDelimiter (character chain)')

expanded = objectFx.expand(flattened, { CustomDelimiter: '|#|' })
tap.strictSame(expanded, nestedObject, 'Expand - CustomDelimiter (character chain)')

/**
 * ExplicitArrays
*/
flattened = objectFx.flatten(nestedObject, { ExplicitArrays: true })
tap.strictSame(flattened, {
  'lets.count[0]': 1,
  'lets.count[1]': 2,
  'lets.count[2]': 3,
  'lets.count[3]': '...',
  'Is.this.deeply.nested.?': 'YEES!!!'
}, 'Flatten - ExplicitArrays')

expanded = objectFx.expand(flattened, { ExplicitArrays: true })
tap.strictSame(expanded, nestedObject, 'Expand - ExplicitArrays')

/**
 * MaxDepth
*/
flattened = objectFx.flatten(nestedObject, { MaxDepth: 1 })
tap.strictSame(flattened, {
  lets: {
    count: [1, 2, 3, '...']
  },
  Is: {
    this: {
      deeply: {
        nested: {
          '?': 'YEES!!!'
        }
      }
    }
  }
}, 'Flatten - MaxDepth: 1')

expanded = objectFx.expand(flattened)
tap.strictSame(expanded, nestedObject, 'Expand - MaxDepth: 1')

flattened = objectFx.flatten(nestedObject, { MaxDepth: 2 })
tap.strictSame(flattened, {
  'lets.count': [1, 2, 3, '...'],
  'Is.this': {
    deeply: {
      nested: {
        '?': 'YEES!!!'
      }
    }
  }
}, 'Flatten - MaxDepth: 2')

expanded = objectFx.expand(flattened)
tap.strictSame(expanded, nestedObject, 'Expand - MaxDepth: 2')

flattened = objectFx.flatten(nestedObject, { MaxDepth: 3 })
tap.strictSame(flattened, {
  'lets.count.0': 1,
  'lets.count.1': 2,
  'lets.count.2': 3,
  'lets.count.3': '...',
  'Is.this.deeply': { nested: { '?': 'YEES!!!' } }
}, 'Flatten - MaxDepth: 3')

expanded = objectFx.expand(flattened)
tap.strictSame(expanded, nestedObject, 'Expand - MaxDepth: 3')

flattened = objectFx.flatten(nestedObject, { MaxDepth: 4 })
tap.strictSame(flattened, {
  'lets.count.0': 1,
  'lets.count.1': 2,
  'lets.count.2': 3,
  'lets.count.3': '...',
  'Is.this.deeply.nested': {
    '?': 'YEES!!!'
  }
}, 'Flatten - MaxDepth: 4')

expanded = objectFx.expand(flattened)
tap.strictSame(expanded, nestedObject, 'Expand - MaxDepth: 4')

flattened = objectFx.flatten(nestedObject, { MaxDepth: 5 })
tap.strictSame(flattened, {
  'lets.count.0': 1,
  'lets.count.1': 2,
  'lets.count.2': 3,
  'lets.count.3': '...',
  'Is.this.deeply.nested.?': 'YEES!!!'
}, 'Flatten - MaxDepth: 5')

expanded = objectFx.expand(flattened)
tap.strictSame(expanded, nestedObject, 'Expand - MaxDepth: 5')

flattened = objectFx.flatten(nestedObject, { MaxDepth: 100 })
tap.strictSame(flattened, {
  'lets.count.0': 1,
  'lets.count.1': 2,
  'lets.count.2': 3,
  'lets.count.3': '...',
  'Is.this.deeply.nested.?': 'YEES!!!'
}, 'Flatten - MaxDepth: bigger than nesting level')

expanded = objectFx.expand(flattened)
tap.strictSame(expanded, nestedObject, 'Expand - MaxDepth: bigger than nesting level')

/**
 * Altogether (use 'unflatten' instead of 'expand' here!)
*/
flattened = objectFx.flatten(nestedObject, { CircularityCheck: true, CustomDelimiter: '~', ExplicitArrays: true, MaxDepth: 3 })
tap.strictSame(flattened, {
  'lets~count[0]': 1,
  'lets~count[1]': 2,
  'lets~count[2]': 3,
  'lets~count[3]': '...',
  'Is~this~deeply': {
    nested: {
      '?': 'YEES!!!'
    }
  }
}, 'Flatten - all options together')

expanded = objectFx.unflatten(flattened, { CustomDelimiter: '~', ExplicitArrays: true })
tap.strictSame(expanded, nestedObject, 'Expand - all options together')
