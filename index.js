
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
  static expand(objFlat, opt) {
    if (Object.prototype.toString.call(objFlat) !== '[object Object]') {
      return null
    }
    const optIsObject = Object.prototype.toString.call(opt) === '[object Object]'
    const DOT = '.'
    const sep = (optIsObject ? opt['KeySeparator'] || DOT : DOT)
    const noArrays = (optIsObject ? opt['NoArrays'] : false)
    const explicitArrays = (optIsObject ? opt['ExplicitArrays'] : false)
    const prefix = 'root' + sep
    const objExp = {}
    const re1 = new RegExp('\\' + sep + '{2,}', 'g')
    const re2 = new RegExp('^\\' + sep + '|\\' + sep + '$', 'g')
    let keys = Object.keys(objFlat)
    for (let i = 0, kln = keys.length; i < kln; i++) {
      const origKey = keys[i]
      let currKey = prefix + origKey
      if (explicitArrays) {
        currKey = currKey.replace(/\[\d+\]/g, (a, b) => {
          return sep + a + sep
        })
        currKey = currKey.replace(re1, sep).replace(re2, '')
      }
      const chunks = currKey.split(sep)
      let obj = objExp
      for (let j = 0, cln = chunks.length; j < cln; j++) {
        let currChunk = chunks[j]
        let nextChunk = chunks[j + 1]
        if (explicitArrays) {
          currChunk = currChunk.replace(/[\[\]]/g, '')
        }
        if (!obj[currChunk]) {
          if (j > cln - 2) {
            obj[currChunk] = objFlat[origKey]
          } else {
            if ((noArrays === false && depictsWholeNumber(nextChunk)) ||
              (explicitArrays && nextChunk.startsWith('[') && nextChunk.endsWith(']') && depictsWholeNumber(nextChunk.replace(/[\[\]]/g, '')))) {
              obj[currChunk] = []
            } else {
              obj[currChunk] = {}
            }
          }
        }
        if (explicitArrays) {
          currChunk.replace(/[\[\]]/g, '')
        }
        obj = obj[currChunk]
      }
    }
    return objExp.root
  }
}

module.exports = ObjectFx
