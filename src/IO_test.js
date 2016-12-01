/* eslint-env mocha */
import A from 'assert';
import fl from 'fantasy-land';
import IO from './IO';
import util from '../_dev/util';
import fantasyLaws from '../_dev/fantasy-laws';

describe('IO', () => {
  const io = IO(() => 2);
  const unchanged = () => A.equal(io.run(), 2);
  const fIO = IO(() => util.double);

  it('reports the right type', () => {
    A.equal(io['@@type'], 'fanta/IO');
  });

  describe('.run()', () => {
    it('dispatches the IO', () => {
      A.equal(IO(() => 2).run(), 2);
    });
  });

  describe('#of(v)', testOf('of'));
  describe('#[fantasy-land/of](v)', testOf(fl.of));

  function testOf(of) {
    return function () {
      it('lifts "v" into an `IO`', () => {
        A.equal(IO[of](2).run(), 2);
      });
    };
  }

  describe('.map(f)', testMap('map'));
  describe('[fantasy-land/map](f)', testMap(fl.map));

  function testMap(map) {
    const mapped = io[map](util.double);

    return function () {
      it('applies "f" to the value in the container', () => {
        A.equal(mapped.run(), 4);
        unchanged();
      });
    };
  }

  describe('.ap(b)', () => {
    it('applies the function in this container to the value in "b"', () => {
      const applied = fIO.ap(io);
      A.equal(applied.run(), 4);
      A.equal(fIO.run(), util.double);
      unchanged();
    });
  });

  describe('[fantasy-land/ap](v)', () => {
    it('applies the function in "b" to the value in this container', () => {
      const applied = io[fl.ap](fIO);
      A.equal(applied.run(), 4);
      A.equal(fIO.run(), util.double);
      unchanged();
    });
  });

  describe('.chain(f)', testChain('chain'));
  describe('[fantasy-land/chain](f)', testChain(fl.chain));

  function testChain(chain) {
    const chained = io[chain](v => IO(() => util.double(v)));

    return function () {
      it('applies "f" to the value in the container and flattens the result', () => {
        A.equal(chained.run(), 4);
        unchanged();
      });
    };
  }

  describe('.toString()', testToString('toString'));
  describe('.inspect()', testToString('inspect'));

  function testToString(tostring) {
    const io2 = IO(function () { return 'foo' }) // eslint-disable-line

    return function () {
      it('returns the string representation of the container', () => {
        const matched = !!io2[tostring]()
          .match(/IO\(function\s\(\)\s{\n?\s+return\s['"]foo['"].+\n?.+}\)/);
        A.equal(matched, true);
      });
    };
  }

  describe('interfaces', () => {
    const laws = fantasyLaws(IO, (a, b) => a.run() === b.run());

    it('Functor', () => laws.functor());
    it('Apply', () => laws.apply());
    it('Applicative', () => laws.applicative());
    it('Chain', () => laws.chain());
    it('Monad', () => laws.monad());
  });
});
