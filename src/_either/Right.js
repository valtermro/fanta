import fl from 'fantasy-land';
import _toString from 'tolb/util/toString';
import ignored from '../_internal/ignored';

export default function Right(value) {
  this._value = value;
}

Right.prototype['@@type'] = 'fanta/Either';
Right.prototype.isLeft = false;
Right.prototype.isRight = true;

Right.prototype.map = function map(f) {
  return new Right(f(this._value));
};

Right.prototype.ap = function ap(b) {
  return b.map(this._value);
};

Right.prototype.chain = function chain(f) {
  return new Right(f(this._value)._value);
};

Right.prototype.getOrElse = function getOrElse(_) {
  return this._value;
};

Right.prototype.orElse = ignored;

Right.prototype.toString = function toString() {
  return `Either.Right(${_toString(this._value)})`;
};

Right.prototype.inspect = Right.prototype.toString;

// fantasy-land compatibility
Right.prototype[fl.map] = Right.prototype.map;
Right.prototype[fl.chain] = Right.prototype.chain;

Right.prototype[fl.ap] = function ap(b) {
  return this.map(b._value);
};
