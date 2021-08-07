const path = require("path");

const { override,
  fixBabelImports,
  addWebpackAlias,
  addWebpackPlugin,
  addPostcssPlugins,
  adjustStyleLoaders } = require('customize-cra');

const resolve = _path => path.resolve(__dirname, _path)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CSSPlugin = config => {
  const modifiedPlugins = config.plugins.map(plugin => {
    if (
      Boolean(plugin.constructor) &&
      plugin.constructor.name === MiniCssExtractPlugin.name
    ) {
      return new MiniCssExtractPlugin({
        ...plugin.options,
        ignoreOrder: true,
      });
    }

    return plugin;
  });

  return { ...config, plugins: modifiedPlugins };
};

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
    CSSPlugin,
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
    }),
  ),
}
