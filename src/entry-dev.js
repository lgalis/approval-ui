import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxLogger from 'redux-logger';
import getStore from './utilities/store';
import App from './App';

ReactDOM.render(
  <Provider store={ getStore([ reduxLogger ]) }>
    <App />
  </Provider>,
  document.getElementById('root')
);
