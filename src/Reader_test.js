/* eslint-env mocha */
import A from 'assert'
import fl from 'fantasy-land'
import Reader from './Reader'
import util from '../_dev/util'
import fantasyLaws from '../_dev/fantasy-laws'

describe('Reader', () => {
  const reader = Reader(util.double)
  const unchanged = () => A.equal(reader._value, util.double)
  const dob = () => util.double
  const fReader = Reader(dob)

  it('reports the right type', () => {
    A.equal(reader['@@type'], 'fanta/Reader')
  })

  describe('.ask', () => {
    it('is a `Reader` of `indentity`', () => {
      A.equal(Reader.ask.run(10), 10)
      A.equal(Reader.ask.map(util.double).run(10), 20)
    })
  })

  describe('.run(ctx)', () => {
    it('dispatches the Reader with "ctx"', () => {
      A.equal(reader.run(2), 4)
    })
  })

  describe('#of(v)', testOf('of'))
  describe('#[fantasy-land/of](v)', testOf(fl.of))

  function testOf(of) {
    return function () {
      it('lifts "v" into an `Reader`', () => {
        A.equal(Reader[of](2).run(), 2)
      })
    }
  }

  describe('.map(f)', testMap('map'))
  describe('[fantasy-land/map](f)', testMap(fl.map))

  function testMap(map) {
    const mapped = reader[map](util.double)

    return function () {
      it('applies "f" to the value in the container', () => {
        A.equal(mapped.run(2), 8)
        unchanged()
      })
    }
  }

  describe('.ap(b)', () => {
    it('applies the function in this container to the value in "b"', () => {
      const applied = fReader.ap(reader)
      A.equal(applied.run(3), 12)
      A.equal(fReader._value, dob)
      unchanged()
    })
  })

  describe('[fantasy-land/ap](v)', () => {
    it('applies the function in "b" to the value in this container', () => {
      const applied = reader[fl.ap](fReader)
      A.equal(applied.run(4), 16)
      A.equal(fReader._value, dob)
      unchanged()
    })
  })

  describe('.chain(f)', testChain('chain'))
  describe('[fantasy-land/chain](f)', testChain(fl.chain))

  function testChain(chain) {
    // Should pass the context to every Reader in the chain
    const fn = v => Reader(x => x).map(x => x * v)
    const chained = reader[chain](fn)

    return function () {
      it('applies "f" to the value in the container and flattens the result', () => {
        A.equal(chained.run(3), 18)
        unchanged()
      })
    }
  }

  describe('.toString()', testToString('toString'))
  describe('.inspect()', testToString('inspect'))

  function testToString(tostring) {
    const reader2 = Reader(function () { return 'foo' }) // eslint-disable-line

    return function () {
      it('returns the string representation of the container', () => {
        const matched = !!reader2[tostring]()
          .match(/Reader\(function\s\(\)\s{\n?\s+return\s['"]foo['"].+\n?.+}\)/)
        A.equal(matched, true)
      })
    }
  }

  describe('interfaces', () => {
    const laws = fantasyLaws(Reader, (a, b) => a.run() === b.run())

    it('Functor', () => laws.functor())
    it('Apply', () => laws.apply())
    it('Applicative', () => laws.applicative())
    it('Chain', () => laws.chain())
    it('Monad', () => laws.monad())
  })
})
