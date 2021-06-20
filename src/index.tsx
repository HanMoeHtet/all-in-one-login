import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { config } from 'dotenv';

import App from './App';
import './index.css';
import store from './store';

config();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
