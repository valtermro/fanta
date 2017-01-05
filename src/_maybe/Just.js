import fl from 'fantasy-land';
import _toString from 'tolb/util/toString';
import ignored from '../_internal/ignored';

export default function Just(v) {
  this._value = v;
}

Just.prototype['@@type'] = 'fanta/Maybe';

Just.prototype.isNothing = false;
Just.prototype.isJust = true;

Just.prototype.map = function map(f) {
  return new Just(f(this._value));
};

Just.prototype.ap = function ap(b) {
  return b.map(this._value);
};

Just.prototype.chain = function chain(f) {
  return new Just(f(this._value)._value);
};

Just.prototype.orElse = ignored;

Just.prototype.getOrElse = function getOrElse(_) {
  return this._value;
};

Just.prototype.toString = function toString() {
  return `Maybe.Just(${_toString(this._value)})`;
};

Just.prototype.inspect = Just.prototype.toString;

// fantasy-land compatibility
Just.prototype[fl.map] = Just.prototype.map;
Just.prototype[fl.chain] = Just.prototype.chain;

Just.prototype[fl.ap] = function ap(b) {
  return this.map(b._value);
};
