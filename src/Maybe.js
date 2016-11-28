import fl from 'fantasy-land'
import _Just from './_maybe/Just'
import _Nothing from './_maybe/Nothing'

const nothing = new _Nothing()

export default function Maybe(value) {
  if (value == null)
    return nothing
  return new _Just(value)
}

Maybe.Nothing = function Nothing() {
  return nothing
}

Maybe.Just = function Just(v) {
  return new _Just(v)
}

Maybe.of = Maybe.Just

Maybe.maybe = function maybe(msg, f, m) {
  const length = arguments.length
  if (length < 2)
    throw new Error('Wrong number of arguments')
  if (length < 3)
    return x => maybe(msg, f, x)

  if (m.isNothing)
    return msg
  return f(m._value)
}

// fantasy-land compatibility
Maybe[fl.of] = Maybe.Just
