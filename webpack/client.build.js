const BabiliPlugin = require('babili-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const commonConfig = require('./config');
const envConfig = require('../server/config');
const prodVendor = commonConfig.vendors.production;
const extractBundle = new ExtractCssChunks({
  filename: '[name].[chunkhash].css'
});

module.exports = {
  cache: true,
  entry: {
    main: [
      'regenerator-runtime/runtime',
      commonConfig.paths.entry
    ],
    vendor: prodVendor
  },
  output: {
    path: commonConfig.paths.output,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    library: '[name]',
    publicPath: envConfig.publicPath
  },
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 'babel-loader', 'eslint-loader' ],
        include: commonConfig.paths.src
      },
      {
        test: /\.scss$/,
        use: ExtractCssChunks.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer'),
                  require('cssnano')
                ]
              }
            },
            'sass-loader'
          ]
        }),
        include: commonConfig.paths.src
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        APP_ENV: JSON.stringify(process.env.APP_ENV)
      }
    }),
    new StyleLintPlugin(),
    extractBundle,
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),
    new BabiliPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new StatsPlugin('stats.json'),
    new ManifestPlugin({
      fileName: 'bundle.json'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html'
    })
  ]
};
