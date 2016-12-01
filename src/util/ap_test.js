/* eslint-env mocha */
import A from 'assert';
import fl from 'fantasy-land';
import ap from './ap';
import util from '../../_dev/util';

describe('ap(b)(a)', () => {
  it('invokes `fantasy-land/ap` on "a" passing "b" to it', () => {
    // Tests only if the method is called on the right object with the right argument
    const apply = { [fl.ap](b) { return b(2); } };
    A.equal(ap(util.double)(apply), 4);
  });
});
