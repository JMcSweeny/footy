var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  entry: [
	    './src/app.ts'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { 
        test: /\.ts?$/, 
        loader: 'ts-loader' ,
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader?name=img/img-[hash:6].[ext]"
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  }
}