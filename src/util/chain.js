import fl from 'fantasy-land'

export default function chain(fn) {
  return function (obj) {
    return obj[fl.chain](fn)
  }
}
