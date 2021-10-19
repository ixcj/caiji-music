let systemConfig = require('./src/config/index')

module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = systemConfig.title
        args[0].description = systemConfig.description
        args[0].keywords = systemConfig.keywords
        args[0].author = systemConfig.author
        args[0].domain = systemConfig.domain
        args[0].fullDomain = systemConfig.fullDomain
        args[0].ogImage = systemConfig.ogImage
        return args
      })
  },
  devServer: {
    proxy: systemConfig.devServerProxy
    ? {
      [systemConfig.DEV_API]: {
        target: systemConfig.BASE_API,
        changeOrigin: true,
        pathRewrite: {
          [`^${systemConfig.DEV_API}`]: ''
        }
      }
    }
    : false
  },
  pwa: {
    name: systemConfig.title,
    themeColor: 'white',
    manifestOptions: {
      start_url: '.',
      background_color: '#f9f9f9'
    },
    appleMobileWebAppCapable: 'yes'
  }
};
