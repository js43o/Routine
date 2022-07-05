import React from 'react';
import ReactDOM from 'react-dom';
import 'sanitize.css';
import store from 'modules';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import App from './App';

// prevent default events
document.ondragstart = () => false;
document.onselectstart = () => false;
document.oncontextmenu = () => false;

const persistor = persistStore(store);
const queryClient = new QueryClient();

ReactDOM.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <PersistGate loading={null} persistor={persistor} />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>,
  document.getElementById('root'),
);
