import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../src/components/App';
import configureStore from '../src/store/configureStore';
import manifest from '../src/manifest.json';

const defaultAssetsManifest = {
  bundleCss: 'bundle.css',
  bundleJs: 'bundle.js',
  vendorJs: 'vendor.js'
};

const isProd = process.env.NODE_ENV === 'production';

export default function serverRenderer({
  clientStats,
  serverStats,
  assetsManifest = defaultAssetsManifest
}) {
  return (req, res) => {
    if (isProd === false) {
      res.status(200).render('index', {
        initialMarkup: '',
        assetsManifest,
        isProd
      });
      return res.end();
    }

    const store = configureStore();
    const context = {};
    const rootComp = (
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
        const markup = renderToString(rootComp);
        res.status(200).render('index', {
          helmet: Helmet.renderStatic(),
          initialMarkup: markup,
          initialState: JSON.stringify(store.getState()),
          manifest,
          assetsManifest,
          isProd
        });
        res.end();
      }
    }).catch((e) => {
      res.status(500).send(e.message);
    });

    renderToString(rootComp);
    return store.close();
  };
}
