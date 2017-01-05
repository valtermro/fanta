/* eslint-env mocha */
const A = require('assert');
const path = require('path');
const fs = require('fs');
const { compose } = require('tolb/combinator');
const { each, filter, map, reduce, reject, slice } = require('tolb/list');
const { isArray, keys } = require('tolb/object');
const { equals } = require('tolb/assert');
const { arity, partial } = require('tolb/function');

const pathFromRoot = partial(arity(3, path.join), [__dirname, '..']);
const isFile = compose(equals('.js'), slice(-3, null));
const isIndex = compose(equals('index.js'), slice(-8, null));

const readFiles = dir => isFile(dir) ? dir : map((f) => {
  const file = path.join(dir, f);
  if (isFile(file))
    return file;
  return readFiles(file);
}, fs.readdirSync(dir));

const resolveFiles = compose(
  reject(x => x.match(/_test\.js$/)),
  reduce((accum, list) => {
    return isArray(list) ?
      Array.prototype.concat.apply(accum, list) :
      accum.concat(list);
  }, []),
  map(compose(readFiles, pathFromRoot))
);

const allFiles = resolveFiles(fs.readdirSync(pathFromRoot('src')));
const files = reject(isIndex, allFiles);
const indexes = filter(isIndex, allFiles);

describe('node bundle', () => {
  it('exports one object per file', () => {
    each((file) => {
      const exported = require(file);

      // Even the "classes" are functions
      A.equal(typeof exported, 'function');
    }, files);
  });

  it('has valid index files', () => {
    each((index) => {
      const dir = path.dirname(index);
      const exported = require(index);

      each((name) => {
        const source = path.join(dir, `${name}.js`);
        A.strictEqual(exported[name], require(source));
      }, keys(exported));
    }, indexes);
  });
});
