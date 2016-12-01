/* eslint-env mocha */
import A from 'assert';
import fl from 'fantasy-land';
import Either from './Either';
import fantasyLaws from '../_dev/fantasy-laws';

describe('Either', () => {
  describe('Either(left, right)', () => {
    it('if "right" has value, lift it into an `Either.Right`', () => {
      const assert = (right) => {
        const obj = Either('', right);
        A.equal(obj.isRight, true);
        A.equal(obj._value, right);
      };
      assert('foo');
      assert(0);
      assert(false);
    });

    it('if "value" does not have value, lift "left" into an `Either.Left`', () => {
      const assert = (value) => {
        const obj = Either('message', value);
        A.equal(obj.isLeft, true);
        A.equal(obj._value, 'message');
      };
      assert(null);
      assert(undefined);
    });

    it('allows partial application', () => {
      const part = Either('message');
      A.equal(part('foo')._value, 'foo');
      A.equal(part(false)._value, false);
      A.equal(part(null)._value, 'message');
      A.equal(part(undefined)._value, 'message');
    });
  });

  describe('#of(v)', testLiftRight('of'));
  describe('[fantasy-land/of](v)', testLiftRight(fl.of));
  describe('#Right(v)', testLiftRight('Right'));

  function testLiftRight(point) {
    return function () {
      it('lifts "v" into an `Either.Right`', () => {
        const res = Either[point]('foo');
        A.equal(res.isRight, true);
        A.equal(res._value, 'foo');
      });
    };
  }

  describe('#Left(v)', () => {
    it('lifts "v" into an `Either.Left`', () => {
      const res = Either.Left('message');
      A.equal(res.isLeft, true);
      A.equal(res._value, 'message');
    });
  });

  describe('#try(f)', () => {
    it('if "f" returns a value, lift it into an `Either.Right`', () => {
      const f = Either.try((x, y) => x + y);
      const res = f(2, 4);
      A.equal(res.isRight, true);
      A.equal(res._value, 6);
    });

    it('if "f" throws, lifts the error into an `Either.Left`', () => {
      const error = Error('message');
      const f = Either.try(() => { throw error; });
      const res = f();

      A.equal(res.isLeft, true);
      A.equal(res._value.message, 'message');
    });
  });

  describe('#either(f, g, e)', () => {
    const right = Either.Right('right');
    const left = Either.Left('left');
    const f = x => `from f ${x}`;
    const g = x => `from g ${x}`;

    it('if "e" is an `Either.Left`, applies "f" to its value', () => {
      A.equal(Either.either(f, g, left), 'from f left');
    });

    it('if "e" is an `Either.Right`, applies "g" to its value', () => {
      A.equal(Either.either(f, g, right), 'from g right');
    });

    it('allows partial application', () => {
      const part = Either.either(f, g);
      A.equal(part(left), 'from f left');
      A.equal(part(right), 'from g right');
    });
  });

  describe('interfaces', () => {
    const laws = fantasyLaws(Either, (a, b) => {
      return a.isLeft === b.isLeft
        && a.isRight === b.isRight
        && a._value === b._value;
    });

    it('Functor', () => laws.functor());
    it('Apply', () => laws.apply());
    it('Applicative', () => laws.applicative());
    it('Chain', () => laws.chain());
    it('Monad', () => laws.monad());
  });
});
