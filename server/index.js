import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import path from 'path';
import helmet from 'helmet';
import fs from 'fs';
import gzipStatic from 'connect-gzip-static';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import apiRouter from './api/index';
import schema from './api/schema';
import config from '../src/config';
import webpackCommonConfig from '../webpack/config';
import appConfig from './config/index';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(gzipStatic(webpackCommonConfig.paths.output));
app.use(favicon(webpackCommonConfig.paths.favicon));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use('/api', apiRouter);

app.use('/graphql', bodyParser.json(), (req, res) => {
  if (req.headers['x-access-token'] !== appConfig.secretToken) {
    res.status(403);
  }
  graphqlExpress({ schema })(req, res);
});

if (process.env.APP_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

let isBuilt = false;

const done = () =>
  !isBuilt &&
  app.listen(config.port, config.host, () => {
    isBuilt = true;
    console.log(`BUILD COMPLETE -- Listening @ http://localhost:${config.port}`);
  });

if (process.env.NODE_ENV !== 'production') {
  const webpackConfig = require('../webpack/dev');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  const bundler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(bundler, {
    publicPath: webpackCommonConfig.paths.publicPath,
    stats: {
      colors: true
    }
  }));
  app.use(webpackHotMiddleware(bundler.compilers.find(compiler => compiler.name === 'client')));
  app.use(webpackHotServerMiddleware(bundler));
  bundler.plugin('done', done);
} else {
  app.use(express.static('public'));
  const serverRenderer = require('../public/main.server.js').default;
  const clientStats = require(path.join(webpackCommonConfig.paths.output, 'stats.json'));
  app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(webpackCommonConfig.paths.src, 'manifest.json'))
  });
  app.get('/sw-scripts.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../scripts/sw-scripts.js'));
  });
  app.use(serverRenderer({ clientStats }));
  done();
}