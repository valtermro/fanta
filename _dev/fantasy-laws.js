const fl = require('fantasy-land')
const { id, double, tripple } = require('./util')
const A = require('assert')

module.exports = function laws(T, eq) {
  const assert = (l, a, b) => {
    if (!eq(a, b))
      A.fail(a, b, l)
  }

  return {
    functor() {
      const u = T.of(2)
      const f = double
      const g = tripple

      assert('functor::identity',
        u[fl.map](id),
        u)
      assert('functor::composition',
        u[fl.map](x => f(g(x))),
        u[fl.map](g)[fl.map](f))
    },

    apply() {
      const v = T.of(4)
      const u = T.of(double)
      const a = T.of(tripple)

      assert('apply::composition',
        v[[fl.ap]](u[[fl.ap]](a[fl.map](f => g => x => f(g(x))))),
        v[[fl.ap]](u)[[fl.ap]](a))
    },

    applicative() {
      const f = double
      const x = 4
      const v = T.of(2)
      const u = T[fl.of](f)

      assert('applicative::identity',
        v[fl.ap](T[fl.of](id)),
        v)
      assert('applicative::homomorphism',
        T[fl.of](x)[fl.ap](T[fl.of](f)),
        T[fl.of](f(x)))
      assert('applicative::interchange',
        T[fl.of](x)[fl.ap](u),
        u[fl.ap](T[fl.of](g => g(x))))
    },

    chain() {
      const f = x => T.of(x * 2)
      const g = x => T.of(x * 3)
      const m = T.of(2)

      assert('chain::associativity',
        m[fl.chain](f)[fl.chain](g),
        m[fl.chain](x => f(x)[fl.chain](g)))
    },

    monad() {
      const a = 2
      const f = y => T.of(y * 2)
      const m = T[fl.of](4)

      assert('chain::left-identity',
        T[fl.of](a)[fl.chain](f),
        f(a))
      assert('chain::right-identity',
        m[fl.chain](T[fl.of]),
        m)
    },
  }
}
