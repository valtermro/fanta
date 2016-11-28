/* eslint-env mocha */
import A from 'assert'
import fl from 'fantasy-land'
import Just from './Just'
import util from '../../_dev/util'

describe('Maybe.Just', () => {
  const just = new Just(2)
  const unchanged = () => A.equal(just._value, 2)

  it('reports the right type', () => {
    A.equal(just['@@type'], 'fanta/Maybe')
  })

  describe('.isNothing', () => {
    it('is `false`', () => {
      A.equal(just.isNothing, false)
    })
  })

  describe('.isJust', () => {
    it('is `true`', () => {
      A.equal(just.isJust, true)
    })
  })

  describe('.map(f)', testMap('map'))
  describe('[fantasy-land/map](f)', testMap(fl.map))

  function testMap(map) {
    const mapped = just[map](util.double)

    return function () {
      it('applies "f" to the value in the container', () => {
        A.equal(mapped._value, 4)
        unchanged()
      })
    }
  }

  describe('.ap(b)', () => {
    const f = new Just(util.double)
    const applied = f.ap(just)

    it('applies the function in this container to the value in "b"', () => {
      A.equal(applied._value, 4)
      A.equal(f._value, util.double)
      unchanged()
    })
  })

  describe('[fantasy-land/ap](b)', () => {
    const f = new Just(util.double)
    const applied = just[fl.ap](f)

    it('applies the function in "b" to the value in this container', () => {
      A.equal(applied._value, 4)
      A.equal(f._value, util.double)
      unchanged()
    })
  })

  describe('.chain(f)', testChain('chain'))
  describe('[fantasy-land/chain](f)', testChain(fl.chain))

  function testChain(chain) {
    const chained = just[chain](v => new Just(util.double(v)))

    return function () {
      it('applies "f" to the value in the container and flattens the result', () => {
        A.equal(chained._value, 4)
        unchanged()
      })
    }
  }

  describe('.getOrElse(v)', () => {
    it('ignores "v" and returns the value in the container', () => {
      A.equal(just.getOrElse(3), 2)
    })
  })

  describe('.orElse(f)', () => {
    it('ignores "f" and returns the current container', () => {
      const f = () => f._called = true
      f._called = false

      A.equal(just.orElse(f), just)
      A.equal(f._called, false)
    })
  })

  describe('.toString()', testToString('toString'))
  describe('.inspect()', testToString('inspect'))

  function testToString(m) {
    const assert = (value) => {
      A.equal(new Just(value)[m](), `Maybe.Just(${value})`)
    }

    return function () {
      it('returns the string representation of the container', () => {
        assert(3)
        assert('foo')
        assert(false)
        assert(null)
      })
    }
  }
})
