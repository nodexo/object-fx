
const depictsWholeNumber = require('depicts-whole-number').onlySafeNumbers

/**
 * Creates a new instance.
 * @class
 */
class ObjectFx {

  /**
   * Expands (unflattens) a flattened object
   * @param {Object} objFlat - flattened object
   * @param {Object} opt - options
   */
  static expand (objFlat, opt) {
    if (Object.prototype.toString.call(objFlat) !== '[object Object]') {
      return null
    }
    const optIsObject = Object.prototype.toString.call(opt) === '[object Object]'
    const DOT = '.'
    const sep = (optIsObject ? opt['KeySeparator'] || DOT : DOT)
    const dnpa = (optIsObject ? opt['DoNotPreserveArrays'] : false)
    const prefix = 'root' + sep
    const objExp = {}
    let keys = Object.keys(objFlat)
    for (let i = 0, kln = keys.length; i < kln; i++) {
      const currKey = prefix + keys[i]
      const chunks = currKey.split(sep)
      let obj = objExp
      for (let j = 0, cln = chunks.length; j < cln; j++) {
        const currChunk = chunks[j]
        const nextChunk = chunks[j + 1]
        if (!obj[currChunk]) {
          if (j > cln - 2) {
            obj[currChunk] = objFlat[currKey.substr(prefix.length)]
          } else {
            if (!dnpa && depictsWholeNumber(nextChunk)) { // && Math.round(nextChunk) <= Number.MAX_SAFE_INTEGER
              obj[currChunk] = []
            } else {
              obj[currChunk] = {}
            }
          }
        }
        obj = obj[currChunk]
      }
    }
    return objExp.root
  }
}

module.exports = ObjectFx
