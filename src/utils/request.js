/*
 * @Author: lmk
 * @Date: 2021-06-17 13:20:42
 * @LastEditTime: 2022-11-23 10:10:25
 * @LastEditors: lmk
 * @Description: common request
 */
import axios from 'axios'
import { store } from "@/stores";
import { Modal, Toast } from 'zarm';
import { setUserToken } from '@/actions/user';

import { isIosPlatform, randomString } from '.';
import fetchAdapter  from './fetchAdapter';



// import { setLoginForm, setUserToken } from '@/actions/user';
// import { getAuth, openLoginPage } from './postMessage';
const isProd = process.env.REACT_APP_NODE_ENV==='production'
console.log(process.env.REACT_APP_NODE_ENV)
// if(istest){
//   headers['Mises-Env'] = 'development'
// }
export const baseURL = isProd ? 'https://api.alb.mises.site/api/v1/' : 'https://api.test.mises.site/api/v1/'
// create an axios instance
const request = axios.create({
  baseURL, // url = base url + request url
  adapter: isIosPlatform()?fetchAdapter:null,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})
// request interceptor
request.interceptors.request.use(
  config => {
    // do something before request is sent
    if(!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    const {token} = store.getState().user
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    let misesDeviceId = localStorage.getItem('misesDeviceId');
    if(!misesDeviceId){
      misesDeviceId = randomString();
      localStorage.setItem('misesDeviceId', misesDeviceId);
    }
    config.headers['mises-device-id'] = misesDeviceId
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
/**
 * @description: 
 * @param {*} 
 * SuccessCode         = 0
 InvalidArgumentCode = 400000
 UnauthorizedCode    = 401000
 ForbiddenCode       = 403000
 NotFoundCode        = 404000
 InternalCode        = 500000
 UnimplementedCode   = 500001
 * @return {*}
 */
// response interceptor
request.interceptors.response.use(
  response => {
    const {data,message,code,pagination,assets} = response.data;
    if(response.data.hasOwnProperty('assets')&&!response.data.hasOwnProperty('code')){
      return assets
    }
    if (code!==0) {
      console.log(message,'message')
      reject(data.data)
      return Promise.reject(new Error(message || 'Error'))
    }
    if(pagination){
      return {data,pagination}
    }
    return data;
  },
  error => {
    error.response&&reject(error.response.data)
    console.log('err:' + error.message) // for debug
    const message = error.response ? error.response.data.message : error.message
    return Promise.reject(message)
  }
)
// const {dispatch} = store
const reject = ({code,message})=>{
  if(code===403002){
    invalidToken()
    return
  }
  if(code===401000){
    invalidAuth()
    return
  }
  // if(code===400000){
  //   invalidAuth()
  //   return
  // }
  console.log(code);
  Toast.show(message|| 'error')
}
const invalidToken = ()=>{
  window.mises.resetUser()
  store.dispatch(setUserToken(''))
  window.location.reload()
}
const invalidAuth = ()=>{
  window.mises.resetUser()
  store.dispatch(setUserToken(''))
  Modal.alert({
    title: 'Message',
    content: 'Connection failed, please reconnect',
    onCancel: () => {
      window.location.replace('/home/me')
    }
  })
}
export default request