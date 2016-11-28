/* eslint-env mocha */
import A from 'assert'
import fl from 'fantasy-land'
import Right from './Right'
import util from '../../_dev/util'

describe('Either.Right', () => {
  const right = new Right(2)
  const unchanged = () => A.equal(right._value, 2)

  it('reports the right type', () => {
    A.equal(right['@@type'], 'fanta/Either')
  })

  describe('.isLeft', () => {
    it('is `false`', () => {
      A.equal(right.isLeft, false)
    })
  })

  describe('.isRight', () => {
    it('is `true`', () => {
      A.equal(right.isRight, true)
    })
  })

  describe('.map(f)', testMap('map'))
  describe('[fantasy-land/map](f)', testMap(fl.map))

  function testMap(map) {
    const mapped = right[map](util.double)

    return function () {
      it('applies "f" to the value in the container', () => {
        A.equal(mapped._value, 4)
        unchanged()
      })
    }
  }

  describe('.ap(b)', () => {
    const f = new Right(util.double)
    const applied = f.ap(right)

    it('applies the function in this container to the value in "b"', () => {
      A.equal(applied._value, 4)
      A.equal(f._value, util.double)
      unchanged()
    })
  })

  describe('[fantasy-land/ap](b)', () => {
    const f = new Right(util.double)
    const applied = right[fl.ap](f)

    it('applies the function in "b" to the value in this container', () => {
      A.equal(applied._value, 4)
      A.equal(f._value, util.double)
      unchanged()
    })
  })

  describe('.chain(f)', testChain('chain'))
  describe('[fantasy-land/chain](f)', testChain(fl.chain))

  function testChain(chain) {
    const chained = right[chain](v => new Right(util.double(v)))

    return function () {
      it('applies "f" to the value in the container and flattens the result', () => {
        A.equal(chained._value, 4)
        unchanged()
      })
    }
  }

  describe('.getOrElse(v)', () => {
    it('ignores "v" and returns the value in the container', () => {
      A.equal(right.getOrElse(3), 2)
    })
  })

  describe('.orElse(f)', () => {
    it('ignores "f" and returns the current container', () => {
      const f = () => f._called = true
      f._called = false

      A.equal(right.orElse(f), right)
      A.equal(f._called, false)
    })
  })

  describe('.toString()', testToString('toString'))
  describe('.inspect()', testToString('inspect'))

  function testToString(m) {
    const assert = (value) => {
      A.equal(new Right(value)[m](), `Either.Right(${value})`)
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
