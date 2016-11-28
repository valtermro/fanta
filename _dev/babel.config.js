const shared = {
  plugins: [
    'check-es2015-constants',
    'transform-es2015-arrow-functions',
    'transform-es2015-block-scoped-functions',
    'transform-es2015-block-scoping',
    'transform-es2015-computed-properties',
    'transform-es2015-destructuring',
    'transform-es2015-duplicate-keys',
    'transform-es2015-function-name',
    'transform-es2015-literals',
    'transform-es2015-parameters',
    'transform-es2015-shorthand-properties',
    'transform-es2015-spread',
    'transform-es2015-sticky-regex',
    'transform-es2015-template-literals',
    'transform-es2015-unicode-regex',
  ],
}

module.exports.node = {
  plugins: shared.plugins.concat([
    'transform-es2015-modules-commonjs',
    'add-module-exports',
  ]),
}

module.exports.next = {
  plugins: shared.plugins.concat([/* */]),
}
