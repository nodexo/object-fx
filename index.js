
const depictsWholeNumber = require('depicts-whole-number').onlySafeNumbers
const c = {
  ESCAPE_CHAR: '\\',
  KEY_SEPARATOR: '.',
  EMPTY_STRING: '',
  REGEX: {
    SQUARE_BRACKETS: /[\[\]]/g,
    EXPLICIT_ARRAY: /\[(0|[1-9][0-9]*)\]/,
    EXPLICIT_ARRAY_GM: /\[(0|[1-9][0-9]*)\]/g
  }
}

/**
 * ObjectFx static class.
 * @class
 */
class ObjectFx {

  /**
   * Checks for valid array index
   * @param {String} s
   * @return {Boolean}
   */
  static _isValidArrayIndex (s) {
    return depictsWholeNumber(s)
  }

  /**
   * Checks for valid array index within square brackets (named 'explicit array' here)
   * @param {String} s
   * @return {Boolean}
   */
  static _containsValidArrayIndex (s) {
    const result = s.match(c.REGEX.EXPLICIT_ARRAY)
    if (!result) {
      return false
    }
    return depictsWholeNumber(result[1])
  }

  /**
   * Expands (unflattens) a flattened object
   * @param {Object} objFlat - flattened object
   * @param {Object} opt - options
   * @return {Object}
   */
  static unflatten (objFlat, opt) {
    return this.expand(objFlat, opt)
  }
  static expand (objFlat, opt) {
    if (Object.prototype.toString.call(objFlat) !== '[object Object]') {
      return null
    }
    const optIsObject = Object.prototype.toString.call(opt) === '[object Object]'
    const SEP = (optIsObject ? opt['KeySeparator'] || c.KEY_SEPARATOR : c.KEY_SEPARATOR)
    const autocreateArrays = (optIsObject ? (opt['AutocreateArrays'] === false ? opt['AutocreateArrays'] : true) : true)
    const explicitArrays = (optIsObject ? opt['ExplicitArrays'] : false)
    const prefix = 'root' + SEP
    const regexConsecutiveSeparators = new RegExp('\\' + SEP + '{2,}', 'g')
    const regexSurroundingSeparators = new RegExp('^\\' + SEP + '+|\\' + SEP + '+$', 'g')
    const objExp = {}
    let keys = Object.keys(objFlat)
    for (let i = 0, kln = keys.length; i < kln; i++) {
      const origKey = keys[i]
      let currKey = prefix + origKey
      if (explicitArrays) {
        currKey = currKey
          .replace(c.REGEX.EXPLICIT_ARRAY_GM, SEP + '[$1]' + SEP)
          .replace(regexConsecutiveSeparators, SEP)
          .replace(regexSurroundingSeparators, c.EMPTY_STRING)
      }
      const chunks = currKey.split(SEP)
      let obj = objExp
      for (let j = 0, cln = chunks.length; j < cln; j++) {
        let currChunk = chunks[j]
        let nextChunk = chunks[j + 1]
        if (explicitArrays) {
          currChunk = currChunk.replace(c.REGEX.SQUARE_BRACKETS, c.EMPTY_STRING)
        }
        if (!obj[currChunk]) {
          if (j > cln - 2) {
            obj[currChunk] = objFlat[origKey]
          } else {
            if ((autocreateArrays && this._isValidArrayIndex(nextChunk)) ||
              (explicitArrays && this._containsValidArrayIndex(nextChunk))) {
              obj[currChunk] = []
            } else {
              obj[currChunk] = {}
            }
          }
        }
        if (explicitArrays && this._containsValidArrayIndex(currChunk)) {
          currChunk.replace(c.REGEX.SQUARE_BRACKETS, c.EMPTY_STRING)
        }
        obj = obj[currChunk]
      }
    }
    return objExp.root
  }

  /**
   * Flattens an object
   * @param {Object} objExp
   * @param {Object} opt - options
   * @return {Object}
   */
  static flatten (objExp, opt) {
    if (Object.prototype.toString.call(objExp) !== '[object Object]') {
      return null
    }
    const optIsObject = Object.prototype.toString.call(opt) === '[object Object]'
    const SEP = (optIsObject ? opt['KeySeparator'] || c.KEY_SEPARATOR : c.KEY_SEPARATOR)
    const circularityCheck = (optIsObject ? opt['CircularityCheck'] : false)
    const maxDepth = parseInt((optIsObject ? opt['MaxDepth'] : 0))
    const explicitArrays = (optIsObject ? opt['ExplicitArrays'] : false)

    if (circularityCheck) {
      try {
        JSON.stringify(objExp)
      } catch (err) {
        if (err.message.match(/circular structure/ig)) {
          throw TypeError('Unable to flatten circular structure')
        }
      }
    }

    let result = {}
    const recurse = (cur, prop, lev) => {
      if (maxDepth > 0 && lev >= maxDepth) {
        result[prop] = cur
        return
      }
      lev++
      if (typeof cur !== 'object') { // Object(cur) !== cur
        result[prop] = cur
      } else if (Array.isArray(cur)) { // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
        for (var i = 0, l = cur.length; i < l; i++) {
          if (explicitArrays) {
            recurse(cur[i], prop + '[' + i + ']', lev)
          } else {
            let prefix = prop
            if (prefix) {
              prefix += SEP
            }
            recurse(cur[i], prefix + i, lev)
          }
        }
        if (l === 0) {
          result[prop] = []
        }
      } else {
        if (Object.prototype.toString.call(cur) === '[object Object]') { // cur && cur.toString() === '[object Object]'
          for (var p in cur) {
            recurse(cur[p], prop ? prop + SEP + p : p, lev)
          }
        } else {
          result[prop] = cur
        }
      }
    }
    recurse(objExp, c.EMPTY_STRING, 0)
    return result
  }

}

module.exports = ObjectFx
