const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'
module.exports = {
  publicPath: BASE_URL,
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.vue$/,
      use: [{
        loader: 'iview-loader', // 解决ivew组件 忽略前缀i的问题
        options: {
          prefix: false
        }
      }]
    })
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    proxy: {
      '/api': {
        target: 'http://120.77.144.78:8888', // http://139.9.38.211:9409
        // http://192.168.1.105
        // ws: true, // 启用websockets
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '/api' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
        }
      },
      '/sjwh': {
        target: 'http://192.168.3.41:9405', // 要请求的后台地址
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/sjwh': '/sjwh' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
        }
      },
      '/qsz_pf': {
        target: 'http://139.9.38.211:9409', // 要请求的后台地址
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/qsz_pf': '/qsz_pf' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
