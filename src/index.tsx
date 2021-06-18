import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { config } from 'dotenv';
import { Provider } from 'react-redux';

import store, { AppDispatch } from './store';
import { checkAuth } from './store/auth/authActions';

config();

(store.dispatch as AppDispatch)(checkAuth());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
