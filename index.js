
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
const defaultOptions = {
  CustomDelimiter: c.KEY_SEPARATOR,
  AutocreateArrays: true,
  ExplicitArrays: false,
  CircularityCheck: false,
  MaxDepth: 0
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
   * @param {Object} userOptions - options
   * @return {Object}
   */
  static unflatten (objFlat, userOptions) {
    return this.expand(objFlat, userOptions)
  }
  static expand (objFlat, userOptions) {
    if (Object.prototype.toString.call(objFlat) !== '[object Object]') {
      return null
    }
    const options = Object.prototype.toString.call(userOptions) === '[object Object]' ? Object.assign({}, defaultOptions, userOptions) : defaultOptions
    const prefix = 'root' + options.CustomDelimiter
    const regexConsecutiveSeparators = new RegExp('\\' + options.CustomDelimiter + '{2,}', 'g')
    const regexSurroundingSeparators = new RegExp('^\\' + options.CustomDelimiter + '+|\\' + options.CustomDelimiter + '+$', 'g')
    const objExp = {}
    let keys = Object.keys(objFlat)
    for (let i = 0, kln = keys.length; i < kln; i++) {
      const origKey = keys[i]
      let currKey = prefix + origKey
      if (options.ExplicitArrays) {
        currKey = currKey
          .replace(c.REGEX.EXPLICIT_ARRAY_GM, options.CustomDelimiter + '[$1]' + options.CustomDelimiter)
          .replace(regexConsecutiveSeparators, options.CustomDelimiter)
          .replace(regexSurroundingSeparators, c.EMPTY_STRING)
      }
      const chunks = currKey.split(options.CustomDelimiter)
      let obj = objExp
      for (let j = 0, cln = chunks.length; j < cln; j++) {
        let currChunk = chunks[j]
        let nextChunk = chunks[j + 1]
        if (options.ExplicitArrays) {
          currChunk = currChunk.replace(c.REGEX.SQUARE_BRACKETS, c.EMPTY_STRING)
        }
        if (!obj[currChunk]) {
          if (j > cln - 2) {
            obj[currChunk] = objFlat[origKey]
          } else {
            if ((options.AutocreateArrays && this._isValidArrayIndex(nextChunk)) ||
              (options.ExplicitArrays && this._containsValidArrayIndex(nextChunk))) {
              obj[currChunk] = []
            } else {
              obj[currChunk] = {}
            }
          }
        }
        if (options.ExplicitArrays && this._containsValidArrayIndex(currChunk)) {
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
   * @param {Object} userOptions - options
   * @return {Object}
   */
  static flatten (objExp, userOptions) {
    if (Object.prototype.toString.call(objExp) !== '[object Object]') {
      return null
    }
    const options = Object.prototype.toString.call(userOptions) === '[object Object]' ? Object.assign({}, defaultOptions, userOptions) : defaultOptions
    if (options.CircularityCheck) {
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
      if (options.MaxDepth > 0 && lev >= options.MaxDepth) {
        result[prop] = cur
        return
      }
      lev++
      if (typeof cur !== 'object') { // Object(cur) !== cur
        result[prop] = cur
      } else if (Array.isArray(cur)) { // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
        for (var i = 0, l = cur.length; i < l; i++) {
          if (options.ExplicitArrays) {
            recurse(cur[i], prop + '[' + i + ']', lev)
          } else {
            let prefix = prop
            if (prefix) {
              prefix += options.CustomDelimiter
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
            recurse(cur[p], prop ? prop + options.CustomDelimiter + p : p, lev)
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
