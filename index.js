
const depictsWholeNumber = require('depicts-whole-number').onlySafeNumbers
const c = {
  DOT: '.',
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
   */
  static expand(objFlat, opt) {
    if (Object.prototype.toString.call(objFlat) !== '[object Object]') {
      return null
    }
    const optIsObject = Object.prototype.toString.call(opt) === '[object Object]'
    const SEP = (optIsObject ? opt['KeySeparator'] || c.DOT : c.DOT)
    const autocreateArrays = (optIsObject ? (opt['AutocreateArrays'] === false ? false : true ) : true)
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
}

module.exports = ObjectFx
