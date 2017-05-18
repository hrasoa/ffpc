import axios from 'axios';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import thunkMiddleware from 'redux-thunk';
import reducers from './src/reducers/index';
import App from './src/components/App';
import config from './config';
import routes from './src/routes';

const loadBranchData = location => {
  const branch = matchRoutes(routes, location.pathname);

  const promises = branch.map(({ route, match }) => {
    return route.loadData
      ? route.loadData(match)
      : Promise.resolve(null)
  });

  return Promise.all(promises)
};

export default function serverRenderer() {
  return (req, res, next) => {

    const store = createStore(
      reducers,
      applyMiddleware(thunkMiddleware)
    );

    //const promises = [];
    loadBranchData(req.url);

    const context = {};
    const markup = (
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}
        >
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    );

    //Promise.all(promises)
      //.then(response => {
        res.status(200).render('index', {
          initialMarkup: ReactDOMServer.renderToString(markup),
          initialState: store.getState(),
          prod: process.env.NODE_ENV === 'production'
        });
        res.end();
      //});

  }
};