import fl from 'fantasy-land'
import _Left from './_either/Left'
import _Right from './_either/Right'

export default function Either(left, right) {
  const length = arguments.length
  if (length < 1)
    throw new Error('Wrong number of arguments')
  if (length < 2)
    return r => Either(left, r)

  if (right == null)
    return new _Left(left)
  return new _Right(right)
}

Either.Left = function Left(v) {
  return new _Left(v)
}

Either.Right = function Right(v) {
  return new _Right(v)
}

Either.of = Either.Right

Either.try = function _try(f) {
  return function (/* args */) {
    try {
      return new _Right(f.apply(undefined, arguments))
    } catch (err) {
      return new _Left(err)
    }
  }
}

Either.either = function either(f, g, e) {
  const length = arguments.length
  if (length < 2)
    throw new Error('Wrong number of arguments')
  if (length < 3)
    return m => either(f, g, m)

  if (e.isLeft)
    return f(e._value)

  if (e.isRight)
    return g(e._value)
}

// fantasy-land compatibility
Either[fl.of] = Either.Right
