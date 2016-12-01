/* eslint-env mocha */
import A from 'assert';
import fl from 'fantasy-land';
import chain from './chain';
import util from '../../_dev/util';

describe('chain(fn)(chain)', () => {
  const obj = { [fl.chain](f) { return f(2); } };

  it('invokes `fantasy-land/chain` on "chain" passing "fn" to it', () => {
    // Tests only if the method is called on the right object with the right argument
    A.equal(chain(util.double)(obj), 4);
  });
});
