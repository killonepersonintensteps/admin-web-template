const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const packageName = require('./package.json').name
module.exports = {
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: true,

  // 引入全局 SCSS 变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [resolve('src/styles/_variables.scss')],
    },
  },

  configureWebpack: {
    output: {
      library: `${packageName}`,
      libraryTarget: 'umd',
    },
  },

  devServer: {
    historyApiFallback: {
      index: '/index.html',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 1234,
    https: false,
    open: true,
    hot: true,
    proxy: {
      '/indata-center': {
        target: 'http://middle-indata-test.swf-sco-dev.svc.cluster.local:9093',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          // '^/api': '',
        },
      },
    },
  },
}
