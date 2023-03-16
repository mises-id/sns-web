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
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const addCompression = (config) => {
  config.plugins.push(
    // gzip压缩
    new CompressionWebpackPlugin({
      test: /\.(css|js)$/,
      // 只处理比1kb大的资源
      threshold: 1024,
      // 只处理压缩率低于90%的文件
      minRatio: 0.9,
    })
  );
  return config;
};

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
    name: "vender",
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        minSize: 50000,
        minChunks: 1,
        chunks: "initial",
        priority: 1, // 该配置项是设置处理的优先级，数值越大越优先处理，处理后优先级低的如果包含相同模块则不再处理
      },
      commons: {
        test: /[\\/]src[\\/]/,
        name: "commons",
        minSize: 50000,
        minChunks: 2,
        chunks: "initial",
        priority: -1,
        reuseExistingChunk: true, // 这个配置允许我们使用已经存在的代码块
      },
      lodash: {
        name: "lodash", // 单独将 lodash 拆包
        priority: 20,
        test: /[\\/]node_modules[\\/]lodash[\\/]/,
        chunks: "all",
      },
      reactLib: {
        name: "react-lib", // 单独将 lodash 拆包
        priority: 20,
        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
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
    addCompression,
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
