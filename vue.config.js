const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = {
  transpileDependencies: [
    '@rdfjs-elements/rdf-editor',
  ],

  configureWebpack: config => {
    // Webpack 5 doesn't provide polyfills so we need to do it manually
    config.resolve.fallback = {
      // "crypto": require.resolve("crypto-browserify"),
      // "stream": require.resolve("stream-browserify"),
      // "assert": require.resolve("assert"),
      // "http": require.resolve("stream-http"),
      // "https": require.resolve("https-browserify"),
      // "os": require.resolve("os-browserify"),
      // "url": require.resolve("url")
      // url: require.resolve('url'),
      "path": ["path-browserify"],
    }

    config.plugins.push(new NodePolyfillPlugin())

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    )
  },

  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with rdf- as custom elements
          isCustomElement: tag => tag.startsWith('rdf-')
        }
      }))
  },

  pwa: {
    name: 'barnard59-steps-playground',
    themeColor: '#ffb15e',
  },
}
