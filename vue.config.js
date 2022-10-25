'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // page title
const port = process.env.port || process.env.npm_config_port || 9527 //  npm run dev --port = 9527 可通过这个命令更改端口号

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/', // 基本路径
  outputDir: 'dist', // 构建时的输出目录
  assetsDir: 'static', // 放置静态资源的目录
  // 在保存时是否试用eslint-loader进行检查
  // lintOnSave: true,
  // 如果不需要生产环境的sourcemap 可以设置为false加快构建
  // productionSourceMap: false,
  // lintOnSave: process.env.NODE_ENV === 'development',
  // productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    port: port,
    open: true, // 启动项目时自动打开浏览器
    overlay: { // 浏览器日志
      warnings: false,
      errors: true
    },
    proxy: {
      // /* 代理地址二 */
      // [process.env.VUE_APP_BASE_API_TWO]: {
      //   /* 目标代理服务器地址 */
      //   target: process.env.VUE_APP_BASE_URL_TWO,
      //   /* 允许跨域 */
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + process.env.VUE_APP_BASE_API_TWO]: '' // 这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
      //   }
      // },
      // /* 代理地址三 */
      // [process.env.VUE_APP_BASE_API_THREE]: {
      //   /* 目标代理服务器地址 */
      //   target: process.env.VUE_APP_BASE_URL_THREE,
      //   /* 允许跨域 */
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + process.env.VUE_APP_BASE_API_THREE]: '' // 这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
      //   }
      // },
      /* 代理地址一 */
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_URL, /* 目标代理服务器地址 */
        changeOrigin: true, /* 允许跨域 */
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '' // 这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) { // 用以配置规则之类的
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module.rule('svg') // 找个配置rule规则里面的svg
      .exclude.add(resolve('src/icons')) // 排除src/icons下的.svg文件
      .end()
    config.module
      .rule('icons') // 配置rule规则里面新增的icons规则
      .test(/\.svg$/) // icons规则里匹配到.svg结尾的文件
      .include.add(resolve('src/icons')) // 包含src/icons下的.svg文件
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' }) // class名
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
