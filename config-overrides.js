/*
 * @Author: lmk
 * @Date: 2021-08-10 01:15:37
 * @LastEditTime: 2022-05-16 10:48:55
 * @LastEditors: lmk
 * @Description:
 */
const path = require("path");

const {
  override,
  fixBabelImports,
  addWebpackAlias,
  adjustStyleLoaders,
} = require("customize-cra");

const resolve = (_path) => path.resolve(__dirname, _path);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CSSPlugin = (config) => {
  const modifiedPlugins = config.plugins.map((plugin) => {
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

const addCommonsChunkPlugin = (config) => {
  config.optimization.splitChunks = {
    chunks: "all",
    name: true,
    minSize: 200000,
    maxSize: 400000,
    minChunks: 1,
    cacheGroups: {
      vendors: {
        name: 'chunk-vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial'
      },
      common: {
        name: 'chunk-common',
        minChunks: 2,
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true
      },
      lodash: {
        name: true, 
        priority: 20,
        test: /[\\/]lodash[\\/]/,
        chunks: "all",
      },
      antdMobile: {
        name: true, 
        priority: 20,
        test: /[\\/]antd-mobile[\\/]/,
        chunks: "async",
      },
      antdMobileIcon: {
        name: true, 
        priority: 20,
        test: /[\\/]antd-mobile-icons[\\/]/,
        chunks: "async",
      },
      betterScroll: {
        name: true, 
        priority: 20,
        test: /[\\/]better-scroll[\\/]/,
        chunks: "async",
      },
      react: {
        name: true, 
        priority: 20,
        test: /[\\/]react(.+?)[\\/]/,
        chunks: "all",
      },
    },
  };
  return config;
};
module.exports = {
  webpack: override(
    // antd-mobile 分包
    fixBabelImports("import", {
      libraryName: "zarm",
      style: "css",
    }),
    //别名
    addWebpackAlias({
      "@": resolve("./src"),
    }),
    CSSPlugin,
    addCommonsChunkPlugin,
    // 添加loader 全局css
    adjustStyleLoaders((rule) => {
      if (rule.test.toString().includes("scss")) {
        rule.use.push({
          loader: require.resolve("sass-resources-loader"),
          options: {
            resources: [resolve("./src/styles/common.scss")],
          },
        });
      }
    })
  ),
};
