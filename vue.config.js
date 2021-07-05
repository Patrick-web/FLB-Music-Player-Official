const WebpackBar = require('webpackbar');

module.exports = {
  devServer: {
    progress: false
  },
  configureWebpack: {
    plugins: [
      new WebpackBar({
        name: 'Building FLB Music Player',
        color: '#0389ff'
      })
    ]
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.flb.flbmusic',
        productName: 'FLB Music',
        copyright: 'MIT',
        publish: ['github']
      }
    }
  }
};
