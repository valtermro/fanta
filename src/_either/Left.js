import fl from 'fantasy-land'
import ignored from '../_internal/ignored'

export default function Left(message) {
  this._value = message
}

Left.prototype['@@type'] = 'fanta/Either'
Left.prototype.isLeft = true
Left.prototype.isRight = false

Left.prototype.map = ignored
Left.prototype.ap = ignored
Left.prototype.chain = ignored

Left.prototype.getOrElse = function getOrElse(v) {
  return v
}

Left.prototype.orElse = function orElse(f) {
  return f()
}

Left.prototype.toString = function toString() {
  return `Either.Left(${this._value})`
}

Left.prototype.inspect = Left.prototype.toString

// fantasy-land compatibility
Left.prototype[fl.map] = ignored
Left.prototype[fl.ap] = ignored
Left.prototype[fl.chain] = ignored
