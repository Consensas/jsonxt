const path = require('path');

module.exports = {
  mode: "production",
  entry: "./lib/index.js",
  devtool: "source-map",
  output: {
    filename: 'jxt.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'JXT',
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: false
  }, 
  node: {
    net: 'empty',
  },
};