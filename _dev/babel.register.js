const babelConfig = require('./babel.config.js');

require('babel-core/register')(babelConfig.node);
