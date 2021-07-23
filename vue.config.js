'use strict'
const path = require('path')
const { HashedModuleIdsPlugin } = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 去掉注释
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const isProd = process.env.NODE_ENV === 'production'

const name = defaultSettings.title || '新视智科' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9555 // dev port
const baseUrl = process.env.VUE_APP_BASE_API
const socketUrl = process.env.VUE_APP_SOCKET_API
// cdn预加载使用
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'element-ui': 'ELEMENT'
}
const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.2/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.1.0/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.1/dist/axios.min.js',
      'https://unpkg.com/element-ui/lib/index.js'
    ]
  }
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',

  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    // open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    // before: require('./mock/mock-server.js')
    proxy: {
      '/api': { // 此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
        // target: process.env.VUE_APP_TYPE === 'edge' ? "http://127.0.0.1:16666" : "http://127.0.0.1:18866",
        // target: 'http://10.53.31.114:18866',
        target: baseUrl,
        // target: 'http://127.0.0.1:18866',
        changeOrigin: true,
        ws: true
      }
      // '/ws': {
      //   // target: process.env.VUE_APP_TYPE === 'edge' ? "ws://127.0.0.1:16666" : "ws://127.0.0.1:18866",
      //   // target: 'ws://10.53.31.114:18866',
      //   // target: 'ws://127.0.0.1:18866',
      //   target: socketUrl,
      //   changeOrigin: true,
      //   ws: true
      // }
    }
  },
  
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/variables.scss";@import "@/styles/mixin.scss";`
      },
      less: { // 配置less（其他样式解析用法一致） 使用ivew
        javascriptEnabled: true // 设置为true
      }
    }
  },
  
  configureWebpack: config => {
    const plugins = []
    if (isProd) {
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false // 去掉注释
            },
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']// 移除console
            }
          }
        })
      )
      // 服务器也要相应开启gzip
      plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.(js|css)$/, // 匹配文件名
          threshold: 10000, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8 // 压缩比
        })
      )

      // 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
      plugins.push(
        new HashedModuleIdsPlugin()
      )


      // 取消webpack警告的性能提示
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积
        maxEntrypointSize: 1000 * 500,
        // 生成文件的最大体积
        maxAssetSize: 1000 * 1000,
        // 只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }

      // 打包时npm包转CDN
      config.externals = externals
    }

    return { plugins }
  },
   
  chainWebpack(config) {
    config.name = name
    config.resolve.alias.set('@', resolve('src'))
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // cdn
    config.plugin('html').tap((args) => {
      isProd ? args[0].cdn = cdn.build : args[0].cdn = cdn.dev
      return args
    })

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module // ivew
      .rule('iview') 
      .test(/iview.src.*?js$/) 
      .use('babel') 
      .loader('babel-loader') 
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
