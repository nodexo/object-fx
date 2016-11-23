
Object FX
=========

**F**latten and e**X**pand for Javascript Objects.

Installation
------------

    npm install object-fx


Usage
-----
Basic example:

```javascript
const objectFx = require('object-fx')

let nestedObject = {
    hello: {
        world: [1, 2, 3, '!']
    }
}

let flattenedObject = objectFx.flatten(nestedObject)
console.log(flattenedObject)
/*
{
    'hello.world.0': 1,
    'hello.world.1': 2,
    'hello.world.2': 3,
    'hello.world.3': '!',
}
*/

let expandedObject = objectFx.expand(flattenedObject)
console.log(expandedObject)
/*
{
    hello: {
        world: [1, 2, 3, '!']
    }
}
*/
```

Common Use Cases
----------------
- Directly utilize redis hashes: Store, manipulate and retrieve Javascript object data easily
- Simplify updates of e.g. MongoDB documents: Don't lose unset properties by using dot notation
- For convenience and "because of the clarity" (e.g. data conversion, debug output) 


API Methods
------------
- [flatten(obj, opt)](#flattenobj-opt)
- [expand(obj, opt)](#expandobj-opt)
- [unflatten(obj, opt)](#unflattenobj-opt)


flatten(obj, opt)
-----------------

Flattens an object.

### Options:

**CustomDelimiter**  
*{String}, defaults to '.' (dot)*  
You can use any char or character chain, but avoid those that are already used within keys.

**ExplicitArrays**  
*{Boolean}, defaults to `false`*  
If set to `true` arrays are flattened in bracket notation, e.g. to `arr[0]` instead of `arr.0`

**MaxDepth**  
*{Number}, defaults to 0*  
Maximum number of (nested) levels to flatten.

**CircularityCheck**  
*{Boolean}, defaults to `false`*  
Perform a check for circular references before flattening an object.  
Without prior testing circular objects will throw `RangeError: Maximum call stack size exceeded`.

Example:

```js
const objectFx = require('object-fx')

let nestedObject = {
    hello: {
        world: [1, 2, 3, '!']
    },
    this: {
        is: {
            deeply: {
                nested: 'OK'
            }
        }
    }
}

let flattenedObject = objectFx.flatten(nestedObject, { ExplicitArrays: true, MaxDepth: 3 })
console.log(flattenedObject)
/*
{
    'hello.world[0]': 1,
    'hello.world[1]': 2,
    'hello.world[2]': 3,
    'hello.world[3]': '!',
    'this.is.deeply': { nested: 'OK' }
}
*/
```

expand(obj, opt)
----------------

Expands an object.

### Options:

**CustomDelimiter**  
*{String}, defaults to '.' (dot)*  
You can use any char or character chain, but avoid those that are already used within keys.

**ExplicitArrays**  
*{Boolean}, defaults to `false`*  
If set to `true`, bracket notations like `arr[0]` will be expanded into arrays, otherwise ignored.

**AutocreateArrays**  
*{Boolean}, defaults to `true`*  
Per default, keys consisting of *whole numbers* are expanded to array indices, e.g. `{ a.0: 'value'}` ⇒ `{ a: [ 'value' ] }`  
Set this option to `false` to create object keys instead: `{ a.0: 'value'}` ⇒ `{ a: { 0: 'value' }`

Example:

```js
const objectFx = require('object-fx')

let flatObject = {
    'hello.world[0]': 1,
    'hello.world[1]': 2,
    'hello.world[2]': 3,
    'hello.world[3]': '!',
    'this.is.deeply': { nested: 'OK' }
}

let expandedObject = objectFx.expand(flatObject, { ExplicitArrays: true })
console.log(expandedObject)
/*
{
    hello: {
        world: [1, 2, 3, '!']
    },
    this: {
        is: {
            deeply: {
                nested: 'OK'
            }
        }
    }
}
*/

```

### unflatten(obj, opt)

Expands an object (alternate method name).  
Uses [expand](#expandobj-opt) under the hood.


License
-------
ISC
