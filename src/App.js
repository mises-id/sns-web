import React from 'react';
import './styles/App.css';
import { ConfigProvider} from 'zarm';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import enUS from 'zarm/lib/config-provider/locale/en_US';
import 'zarm/dist/zarm.css';
import routeConfig from './router';
import { routes } from './utils/reactUtil';
import { Provider } from 'react-redux';
import { persistor, store } from './stores';
import {PersistGate} from 'redux-persist/lib/integration/react';
function App() {
  return (
    <ConfigProvider locale={enUS} primaryColor="#5c65f6">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <Switch>
              {routes(routeConfig)}
              <Redirect to="/home" />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
