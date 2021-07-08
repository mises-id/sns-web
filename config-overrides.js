const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

/* config-overrides.js */
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  // alias
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': resolve('src'),
    '@components': resolve('components'),
    '@view': resolve('src/view')
  };
  config.resolve.extensions = ['.js','.jsx','.json'];
  return config;
}