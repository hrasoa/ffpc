const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const envConfig = require('../server/config');
const shared = require('./shared');

const extractChunk = new ExtractCssChunks();
const cacheLoader = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: path.resolve('node_modules/.cache/cache-loader')
  }
};

module.exports = [{
  cache: true,
  name: 'client',
  target: 'web',
  entry: [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    shared.paths.critical,
    shared.paths.fonts,
    shared.paths.bundle,
    shared.paths.entry
  ],
  output: {
    path: shared.paths.output,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: envConfig.publicPath
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ttf|ttc|otf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 9999999 // always return data uri
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          cacheLoader,
          'babel-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractCssChunks.extract({
          fallback: 'style-loader',
          use: [
            cacheLoader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                importLoaders: 1,
                plugins: [
                  require('autoprefixer')
                ]
              }
            },
            'sass-loader'
          ]
        }),
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    symlinks: false
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new StyleLintPlugin(),
    extractChunk,
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}, {
  name: 'server',
  target: 'node',
  entry: [path.resolve(__dirname, '../server/app/render.js')],
  output: {
    path: shared.paths.outputServer,
    filename: 'render.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(ttf|ttc|otf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          cacheLoader,
          'babel-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          cacheLoader,
          'css-loader/locals',
          'sass-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    symlinks: false
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        APP_ENV: JSON.stringify(process.env.APP_ENV)
      }
    })
  ]
}];
