/* eslint-env mocha */
import A from 'assert';
import fl from 'fantasy-land';
import Left from './Left';
import util from '../../_dev/util';

describe('Either.Left', () => {
  const left = new Left('some message');
  const unchanged = () => A.equal(left._value, 'some message');

  it('reports the right type', () => {
    A.equal(left['@@type'], 'fanta/Either');
  });

  describe('.isLeft', () => {
    it('is `true`', () => {
      A.equal(left.isLeft, true);
    });
  });

  describe('.isRight', () => {
    it('is `false`', () => {
      A.equal(left.isRight, false);
    });
  });

  describe('.map(f)', testIgnored('f', 'map'));
  describe('.ap(b)', testIgnored('b', 'ap'));
  describe('.chain(f)', testIgnored('f', 'chain'));

  describe('[fantasy-land/map](f)', testIgnored('f', fl.map));
  describe('[fantasy-land/ap](b)', testIgnored('b', fl.ap));
  describe('[fantasy-land/chain](f)', testIgnored('f', fl.chain));

  function testIgnored(a, method) {
    return function () {
      it(`ignores "${a}" and returns the current container`, () => {
        A.equal(left[method](util.toUpper), left);
        unchanged();
      });
    };
  }

  describe('.getOrElse(v)', () => {
    it('returns "v"', () => {
      A.equal(left.getOrElse(3), 3);
    });
  });

  describe('.orElse(f)', () => {
    it('invokes "f" and returns its value', () => {
      A.equal(left.orElse(() => 'foo'), 'foo');
    });
  });

  describe('.toString()', testToString('toString'));
  describe('.inspect()', testToString('inspect'));

  function testToString(m) {
    const assert = (value, wanted) => {
      A.equal(new Left(value)[m](), `Either.Left(${wanted})`);
    };

    return function () {
      it('returns the string representation of the container', () => {
        assert(3, '3');
        assert('foo', '"foo"');
        assert(false, 'false');
        assert(null, 'null');

        const matched = !!(new Left(function foo() { return 'foo'; }))[m]()
          .match(/Either.Left\(function foo\(\)\s{\n?\s+return\s['"]foo['"].+\n?.+}\)/);
        A.equal(matched, true);
      });
    };
  }
});
