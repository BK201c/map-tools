"use strict";
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  filenameHashing: true,

  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,

  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],

  // 生产环境 sourceMap
  productionSourceMap: false,

  // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
  // corsUseCredentials: false,
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: "text-loader"
        }
      ]
    }
  },

  // webpack 链接 API，用于生成和修改 webapck 配置
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "MapTools";
      return args;
    });
  },

  // All options for webpack-dev-server are supported
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    open: false,

    port: 9090,

    https: false,

    hotOnly: true
  },

  // 构建时开启多进程处理 babel 编译
  parallel: require("os").cpus().length > 1,

  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // 第三方插件配置
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/"
        },
        appId: "com.mapTools.app",
        copyright: "Copyright 2020-2021",
        productName: "MapTools",
        files: ["!dist/**/*"],
        win: {
          target: ["zip"],
          icon: "./public/logo.png"
        }
      }
    }
  }
};
