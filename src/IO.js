import fl from 'fantasy-land';

export default function IO(action) {
  if (!(this instanceof IO))
    return new IO(action);

  this._value = action;
}

IO.of = function of(v) {
  return new IO(() => v);
};

IO.prototype['@@type'] = 'fanta/IO';

IO.prototype.run = function run() {
  return this._value();
};

IO.prototype.map = function map(f) {
  return new IO(() => f(this._value()));
};

IO.prototype.ap = function ap(b) {
  return b.map(this._value());
};

IO.prototype.chain = function chain(f) {
  return new IO(() => f(this._value())._value());
};

IO.prototype.toString = function toString() {
  return `IO(${String(this._value)})`;
};

IO.prototype.inspect = IO.prototype.toString;

// fantasy-land compatibility
IO[fl.of] = IO.of;
IO.prototype[fl.map] = IO.prototype.map;
IO.prototype[fl.chain] = IO.prototype.chain;

IO.prototype[fl.ap] = function ap(b) {
  return this.map(b._value());
};
