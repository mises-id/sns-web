const path = require("path");

const { override,
  fixBabelImports,
  addWebpackAlias,
  addPostcssPlugins,
  adjustStyleLoaders } = require('customize-cra');

const resolve = _path => path.resolve(__dirname, _path)

module.exports = {
  webpack: override(
    // antd-mobile 分包
    fixBabelImports('import', {
      libraryName: 'zarm',
      style: 'css',
    }),
    //别名
    addWebpackAlias({
      ['@']: resolve("./src")
    }),
    // 添加loader 全局css
    adjustStyleLoaders(rule => {
      if (rule.test.toString().includes('scss')) {
        rule.use.push({
          loader: require.resolve('sass-resources-loader'),
          options: {
            resources: [resolve("./src/styles/common.scss")]
          }
        });
      }
    })
  ),
}
