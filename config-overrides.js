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
    minSize: 30000, 
    maxAsyncRequests: 5, 
    maxInitialRequests: 3, 
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        minSize: 20000,
        minChunks: 1,
        chunks: "initial",
        priority: 1,
      },
      reactLib: { 
        chunks: 'all',
        test: /(react|react-dom|react-dom-router|babel-polyfill|react-redux|redux|redux-persist)/,
        priority: 100,
        name: "react-lib",
      },
      lodash: {
        name: "lodash", 
        priority: 20,
        test: /[\\/]node_modules[\\/]lodash[\\/]/,
        chunks: "all",
      },
      konvaLib: {
        name: "konva", 
        priority: 20,
        test: /[\\/]node_modules[\\/]konva[\\/]/,
        chunks: "async",
      },
      antdMobile: {
        name: "antd-mobile", 
        priority: 20,
        test: /[\\/]node_modules[\\/]antd-mobile[\\/]/,
        chunks: "all",
      },
      zarmLib: {
        name: "zarm", 
        priority: 20,
        test: /[\\/]node_modules[\\/]zarm[\\/]/,
        chunks: "async",
      },
      betterScrollLib: {
        name: "better-scroll", 
        priority: 20,
        test: /[\\/]node_modules[\\/]better-scroll[\\/]/,
        chunks: "async",
      },
      ethersprojectLib: {
        name: "ethersproject", 
        priority: 20,
        test: /[\\/]node_modules[\\/]@ethersproject[\\/]/,
        chunks: "async",
      },
      idnaUts46HxLib: {
        name: "idna-uts46-hx", 
        priority: 20,
        test: /[\\/]node_modules[\\/]idna-uts46-hx [\\/]/,
        chunks: "async",
      },
      commons: {
        test: /[\\/]src[\\/]/,
        name: "commons",
        minChunks: 2,
        minSize: 0,
        chunks: "initial",
        priority: -1,
        reuseExistingChunk: true, 
      }
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
