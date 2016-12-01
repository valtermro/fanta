import fl from 'fantasy-land';

export default function Reader(run) {
  if (!(this instanceof Reader))
    return new Reader(run);
  this._value = run;
}

Reader.prototype['@@type'] = 'fanta/Reader';

Reader.ask = new Reader(x => x);

Reader.of = function of(v) {
  return new Reader(() => v);
};

Reader.prototype.run = function run(ctx) {
  return this._value(ctx);
};

Reader.prototype.map = function map(f) {
  return new Reader(ctx => f(this._value(ctx)));
};

Reader.prototype.ap = function ap(b) {
  return b.map(this._value());
};

Reader.prototype.chain = function chain(f) {
  return new Reader(r => f(this._value(r))._value(r));
};

Reader.prototype.toString = function toString() {
  return `Reader(${String(this._value)})`;
};

Reader.prototype.inspect = Reader.prototype.toString;

// fantasy-land compatibility
Reader[fl.of] = Reader.of;
Reader.prototype[fl.map] = Reader.prototype.map;
Reader.prototype[fl.chain] = Reader.prototype.chain;

Reader.prototype[fl.ap] = function ap(b) {
  return this.map(b._value());
};
