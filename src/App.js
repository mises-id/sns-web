/*
 * @Author: lmk
 * @Date: 2021-07-07 23:23:36
 * @LastEditTime: 2022-01-18 17:44:59
 * @LastEditors: lmk
 * @Description: 
 */
import React, { useEffect } from 'react';
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
import { hot } from 'react-hot-loader/root'
import {setTheme} from '@/styles/setZarmTheme'
import { CacheSwitch } from 'react-router-cache-route'
const App = ()=> {
  useEffect(() => {
    setTheme()
  }, [])
  return (
    <ConfigProvider locale={enUS} theme="light" primaryColor='#5c65f6'>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <CacheSwitch>
              {routes(routeConfig)}
              <Redirect to="/home/discover" />
            </CacheSwitch>
          </Router>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default process.env.NODE_ENV === "development" ? hot(App) : App;
