module.exports = {
  entry: {
    'httpPostMessage': './src/httpPostMessage.ts',
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: 'http-post-message',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}