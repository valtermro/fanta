/* eslint-env mocha */
import A from 'assert';
import is from './is';

describe('is(type, obj)', () => {
  const io = { '@@type': 'fanta/IO' };
  const either = { '@@type': 'fanta/Either' };
  const maybe = { '@@type': 'fanta/Maybe' };

  it('checks if object is a container of "type"', () => {
    A.equal(is('Either', io), false);
    A.equal(is('Either', either), true);
    A.equal(is('IO', io), true);
    A.equal(is('Maybe', maybe), true);
  });

  it('allows partial application', () => {
    A.equal(is('Either')(either), true);
    A.equal(is('Either')(undefined), false);
    A.equal(is('Either')(null), false);
  });
});
