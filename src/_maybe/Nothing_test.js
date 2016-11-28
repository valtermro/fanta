/* eslint-env mocha */
import A from 'assert'
import fl from 'fantasy-land'
import Nothing from './Nothing'

describe('Maybe.Nothing', () => {
  const nothing = new Nothing()

  it('reports the right type', () => {
    A.equal(nothing['@@type'], 'fanta/Maybe')
  })

  describe('.isNothing', () => {
    it('is `true`', () => {
      A.equal(nothing.isNothing, true)
    })
  })

  describe('.isJust', () => {
    it('is `false`', () => {
      A.equal(nothing.isJust, false)
    })
  })

  describe('.map(f)', testIgnored('f', 'map'))
  describe('.ap(b)', testIgnored('b', 'ap'))
  describe('.chain(f)', testIgnored('f', 'chain'))

  describe('[fantasy-land/map](f)', testIgnored('f', fl.map))
  describe('[fantasy-land/ap](b)', testIgnored('b', fl.ap))
  describe('[fantasy-land/chain](f)', testIgnored('f', fl.chain))

  function testIgnored(a, method) {
    const f = () => f._called = true
    f._called = false

    return function () {
      it(`ignores "${a}" and returns the current container`, () => {
        A.equal(nothing[method](f), nothing)
        A.equal(f._called, false)
      })
    }
  }

  describe('.orElse(f)', () => {
    it('invokes "f" and returns its value', () => {
      A.equal(nothing.orElse(() => 'foo'), 'foo')
    })
  })

  describe('.getOrElse(v)', () => {
    it('returns "v"', () => {
      A.equal(nothing.getOrElse('foo'), 'foo')
    })
  })

  describe('.toString()', testToString('toString'))
  describe('.inspect()', testToString('inspect'))

  function testToString(m) {
    return function () {
      it('returns the string representation of the container', () => {
        A.equal(nothing[m](), 'Maybe.Nothing()')
      })
    }
  }
})
