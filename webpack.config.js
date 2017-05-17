const webpack = require('webpack');
const { resolve } = require('path');

module.exports = [{
  name: 'client',
  target: 'web',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    publicPath: '/',
    contentBase: resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: resolve(__dirname, 'src')
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: resolve(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        include: resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}, {
  name: 'server',
  target: 'node',
  entry: './serverRenderer.js',
  output: {
    path: resolve(__dirname, 'public'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
];
