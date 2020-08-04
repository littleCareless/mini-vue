  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      index: './src/core/instance/index.js',
      // print: './src/print.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Development',
        template: './template/index.html',
        inject:'head'
      }),
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
  }