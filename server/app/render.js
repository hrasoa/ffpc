import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import App from '../../src/components/App';
import configureStore from '../../src/store/configureStore';
import manifest from '../../src/manifest.json';
import conf from '../config';

const { gtmID } = conf;

export default function serverRenderer({
  clientStats,
  options = {}
}) {
  return (req, res) => {
    const {
      isProd,
      fontsCookieName,
      bundleCss,
      fontsCss,
      criticalCssRaw
    } = options;
    const store = configureStore();
    const context = {};

    const RootComp = (
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          <App />
        </StaticRouter>
      </Provider>
    );

    store.runSaga().done.then(() => {
      if (context.url) {
        res.writeHead(301, {
          Location: context.url
        });
        res.end();
      } else {
        const markup = renderToString(RootComp);
        const chunkNames = flushChunkNames();
        const flushed = flushChunks(clientStats, { chunkNames });
        const {
          js,
          styles,
          scripts,
          stylesheets,
          cssHash,
          publicPath
        } = flushed;

        res.status(200).render('index', {
          helmet: Helmet.renderStatic(),
          initialMarkup: markup,
          initialState: JSON.stringify(store.getState()),
          gtmID,
          css: [bundleCss, ...stylesheets].map(s => `${publicPath}/${s}`),
          criticalCssRaw,
          manifest,
          fontsCss: `${publicPath}/${fontsCss}`,
          preloadJs: scripts.map(s => `${publicPath}/${s}`),
          js,
          fontsCookieName,
          styles,
          cssHash,
          isProd
        });
        res.end();
      }
    }).catch((e) => {
      res.status(500).send(e.message);
    });

    renderToString(RootComp);
    store.close();
  };
}
