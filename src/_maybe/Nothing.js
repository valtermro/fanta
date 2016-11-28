import fl from 'fantasy-land'
import ignored from '../_internal/ignored'

export default function Nothing() { /* nothing means nothing */ }

Nothing.prototype['@@type'] = 'fanta/Maybe'
Nothing.prototype.isNothing = true
Nothing.prototype.isJust = false

Nothing.prototype.map = ignored
Nothing.prototype.ap = ignored
Nothing.prototype.chain = ignored

Nothing.prototype.getOrElse = function getOrElse(v) {
  return v
}

Nothing.prototype.orElse = function orElse(f) {
  return f()
}

Nothing.prototype.toString = function toString() {
  return 'Maybe.Nothing()'
}

Nothing.prototype.inspect = Nothing.prototype.toString

// fantasy-land compatibility
Nothing.prototype[fl.map] = ignored
Nothing.prototype[fl.ap] = ignored
Nothing.prototype[fl.chain] = ignored
