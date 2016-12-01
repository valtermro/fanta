/* eslint-env mocha */
import A from 'assert';
import fl from 'fantasy-land';
import Maybe from './Maybe';
import util from '../_dev/util';
import fantasyLaws from '../_dev/fantasy-laws';

describe('Maybe', () => {
  describe('Maybe(v)', () => {
    it('if "v" has value, lift it into an `Maybe.Just`', () => {
      const assert = (v) => {
        const obj = Maybe(v);
        A.equal(obj.isJust, true);
        A.equal(obj._value, v);
      };
      assert('foo');
      assert(0);
      assert(false);
    });

    it('if "v" does not have value, returns a `Maybe.Nothing`', () => {
      const assert = (v) => {
        const res = Maybe(v);
        A.equal(res.isNothing, true);
        A.equal(res._value, undefined);
      };
      assert(null);
      assert(undefined);
    });
  });

  describe('#Nothing()', () => {
    it('returns a `Maybe.Nothing`', () => {
      const res = Maybe.Nothing();
      A.equal(res.isNothing, true);
      A.equal(res._value, undefined);
    });
  });

  describe('#of(v)', testListJust('of'));
  describe('[fantasy-land/of](v)', testListJust(fl.of));
  describe('#Just(v)', testListJust('Just'));

  function testListJust(point) {
    return function () {
      it('lifts "v" into an `Maybe.Just`', () => {
        const res = Maybe[point]('foo');
        A.equal(res.isJust, true);
        A.equal(res._value, 'foo');
      });
    };
  }

  describe('#maybe(message, f, m)', () => {
    const just = Maybe.Just(2);
    const nothing = Maybe.Nothing();
    const msg = 'message';

    it('if "m" is a `Maybe.Just`, applies "f" to its value', () => {
      A.equal(Maybe.maybe(msg, util.double, just), 4);
    });

    it('if "m" is a `Maybe.Nothing`, return "message"', () => {
      A.equal(Maybe.maybe(msg, util.double, nothing), msg);
    });

    it('allows partial application', () => {
      const part = Maybe.maybe(msg, util.double);
      A.equal(part(just), 4);
      A.equal(part(nothing), msg);
    });
  });

  describe('interfaces', () => {
    const laws = fantasyLaws(Maybe, (a, b) => {
      return a.isNothing === b.isNothing
        && a.isJust === b.isJust
        && a._value === b._value;
    });

    it('Functor', () => laws.functor());
    it('Apply', () => laws.apply());
    it('Applicative', () => laws.applicative());
    it('Chain', () => laws.chain());
    it('Monad', () => laws.monad());
  });
});
