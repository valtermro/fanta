/* eslint-env mocha */
import A from 'assert'
import fl from 'fantasy-land'
import map from './map'
import util from '../../_dev/util'

describe('map(fn)(functor)', () => {
  it('invokes `fantasy-land/map` on "functor" passing "fn" to it', () => {
    // Tests only if the method is called on the right object with the right argument
    const functor = { [fl.map](f) { return f(2) } }
    A.equal(map(util.double)(functor), 4)
  })
})
