module.exports = {  
  entry: './test/httpPostMessage.spec.ts',
  output: {
    path: __dirname + "/tmp",
    filename: 'httpPostMessage.spec.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  ts: {
    configFileName: "webpack.tsconfig.json"
  }
}