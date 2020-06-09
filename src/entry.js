import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './utilities/store';
import App from './App';

ReactDOM.render(
  <Provider store={ getStore() }>
    <App />
  </Provider>,
  document.getElementById('root')
);
