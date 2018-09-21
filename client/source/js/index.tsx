import './debug';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppComponent } from 'components/hybrid/AppComponent';
import { store } from 'reducers/store';

ReactDOM.render(
  (<Provider store={store}>
    <AppComponent />
  </Provider>),
  document.getElementById('mount')
);