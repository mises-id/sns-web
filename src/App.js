import React, { useEffect } from 'react';
import './styles/App.css';
import { ConfigProvider} from 'zarm';
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import enUS from 'zarm/lib/config-provider/locale/en_US';
import 'zarm/dist/zarm.css';
import routeConfig from './router';
import { routes } from './utils/reactUtil';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { persistor, store } from './stores';
import {PersistGate} from 'redux-persist/lib/integration/react';
import { hot } from 'react-hot-loader/root'
import {setTheme} from '@/styles/setZarmTheme'
import { CacheSwitch } from 'react-router-cache-route'
// import { useState } from 'react';
import { useLogin } from './components/PostsIcons/common';
import { setVisibility } from './actions/app';
import { Popup } from 'antd-mobile';
import { isMisesBrowser } from './utils';
const SetRoute = ()=>{
  const {isLogin} = useLogin()
  return <Router>
  <CacheSwitch>
    {routes(routeConfig)}
    <Redirect to={isLogin ? "/home/discover" : "/home/me"} />
  </CacheSwitch>
</Router>
}
const  Download = ()=>{
  // const selector = useSelector((state) => state.user) || {};
  const isMises = isMisesBrowser()
  return !isMises&&!['/download'].includes(window.location.pathname) ? <>
    <div className='launchApp m-flex'>
      <div className='m-flex-1 m-flex'>
        <img src="/static/images/logo.png" alt="" className='launchApp-logo'/>
        <p className='launchApp-txt'>
          <span>Mises </span>
          - A social network protocol based on blockchain technology
        </p>
      </div>
      <div className='download-btn' onClick={()=>{
        window.location.href = '/download'
      }}>Download</div>
    </div>
    <div className='launchApp-empty'></div>
  </> : ''
}
// 封装antd的popup
const DownloadPopUp = ()=>{
  const visible = useSelector(state=>state.app.visible)
  const dispatch = useDispatch()
  return <Popup
    visible={visible}
    onMaskClick={() => {
      dispatch(setVisibility(false))
    }}
    destroyOnClose
    bodyStyle={{
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
    }}
  >
    <img src="/static/images/logo.png" alt="" className='popup-img'/>
    <p className='popup-txt'>Download Mises to start your Web3 journey</p>
    <div className='popup-btn' onClick={()=>{
        dispatch(setVisibility(false))
        window.location.href = '/download'
      }}>Download</div>
  </Popup>
}
  

const App = ()=> {
  // const [isHref, setisHref] = useState(false)
 
  useEffect(() => {
    setTheme()
    // const error = e=>{
    //   if(e.message==="Uncaught SyntaxError: Unexpected token '<'" 
    //   || (e.reason && ["CSS_CHUNK_LOAD_FAILED","ChunkLoadError"].includes(e.reason.code || e.reason.name))){
    //     const pathname = window.location.pathname
    //     if(!isHref&&pathname!=='error'){
    //       window.location.replace('/error')
    //       setisHref(true)
    //     }
    //   }
    // }
    // window.addEventListener('error',error,true)
    // window.addEventListener('unhandledrejection',error)
    // return ()=>{
    //   window.removeEventListener('error',error)
    //   window.removeEventListener('unhandledrejection',error)
    // }
    // eslint-disable-next-line
  }, [])
  return <ConfigProvider locale={enUS} theme="light" primaryColor='#5c65f6'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Download />
        <SetRoute />
        <DownloadPopUp />
      </PersistGate>
    </Provider>
  </ConfigProvider>;
}

export default process.env.NODE_ENV === "development" ? hot(App) : App;
