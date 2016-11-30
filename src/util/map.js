import fl from 'fantasy-land'

export default function map(fn) {
  return function (functor) {
    return functor[fl.map](fn)
  }
}
