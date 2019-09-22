const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config.js')

const compiler = Webpack(webpackConfig)
const devServerOptions = Object.assign({}, {
  open: true,
  hot: true
})
const server = new WebpackDevServer(compiler, devServerOptions)

server.listen(8077, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8077')
})
