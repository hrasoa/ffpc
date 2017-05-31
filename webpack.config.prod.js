const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  cache: true,
  entry: {
    bundle: './src/index.js'
  },
  output: {
    path: resolve(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
    library: '[name]'
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['happypack/loader'],
        include: resolve(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }),
        include: resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HappyPack({
      loaders: [ 'babel-loader', 'eslint-loader' ]
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(resolve(__dirname, 'dll', 'vendor-manifest.json'))
    }),
    new ExtractTextPlugin({
      filename: 'bundle.[chunkhash].css'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json' }
    ]),
    new ManifestPlugin({
      fileName: 'bundle-manifest.json'
    })
  ]
};
