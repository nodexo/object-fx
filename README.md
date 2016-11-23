
Object FX
=========

**F**latten and e**X**pand for Javascript Objects.

Common Use Cases
----------------
- Directly utilize redis hashes: Store, manipulate and retrieve Javascript object data easily
- Simplify updates of e.g. MongoDB documents: Don't lose unset properties by using dot notation
- For convenience and "because of the clarity" (e.g. data conversion, debug output) 

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

API Methods
------------
- [flatten(obj)](#flattenobj-opt)
- [expand(obj)](#expandobj-opt)
- [unflatten(obj)](#unflattenobj-opt)


### flatten(obj, opt)

Flattens an object.

#### Options
- KeySeparator: String,  defaults to '.'
- ExplicitArrays: Boolean, defaults to false
- CircularityCheck: Boolean, defaults to false
- MaxDepth: Number, defaults to 0


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



### expand(obj, opt)

Expands an object.

#### Options
- KeySeparator: String,  defaults to '.'
- AutocreateArrays: Boolean, defaults to true
- ExplicitArrays: Boolean, defaults to false


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

Expands an object (alternative method name). 
Uses [expand](#expandobj-opt) under the hood.


License
-------
ISC
