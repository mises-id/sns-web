/*
 * @Author: lmk
 * @Date: 2021-07-07 23:23:36
 * @LastEditTime: 2022-02-15 14:56:50
 * @LastEditors: lmk
 * @Description: 
 */
import React, { useEffect } from 'react';
import './styles/App.css';
import { ConfigProvider} from 'zarm';
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
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
import { useState } from 'react';
const App = ()=> {
  const [hasToken, sethasToken] = useState('');
  // const history = useHistory()
  useEffect(() => {
    setTheme()
    const token = store.getState().user.token
    sethasToken(token)
    // const whiteList = ['/','/home/following','/home/discover','/home/me']
    // const pathname = window.location.pathname
    // if(!token&&!whiteList.includes(pathname)){
    //   console.log(pathname);
    //   window.location.replace('/')
    // }
  }, [])
  return (
    <ConfigProvider locale={enUS} theme="light" primaryColor='#5c65f6'>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <CacheSwitch>
              {routes(routeConfig,'',hasToken)}
              <Redirect to={hasToken ? "/home/discover" : "/home/me"} />
            </CacheSwitch>
          </Router>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default process.env.NODE_ENV === "development" ? hot(App) : App;
