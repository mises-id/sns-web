/*
 * @Author: lmk
 * @Date: 2021-06-17 13:20:42
 * @LastEditTime: 2021-08-19 23:49:03
 * @LastEditors: lmk
 * @Description: common request
 */
import axios from 'axios'
import { store } from "@/stores";
import { Toast } from 'zarm';
import { setLoginForm, setUserToken } from '@/actions/user';
import { getAuth, openLoginPage } from './postMessage';
export const baseURL = 'https://api.mises.site/api/v1/'
// create an axios instance
const request = axios.create({
  baseURL, // url = base url + request url http://47.100.235.21:12338
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
    const {data,message,code,pagination} = response.data;
    if (code!==0) {
      console.log(message,'message')
      reject(data.data)
      return Promise.reject(new Error(message || 'Error'))
    }
    const res  = pagination ? {data,pagination} : data;
    return res;
  },
  error => {
    error.response&&reject(error.response.data)
    console.log('err' + error.message) // for debug
    return Promise.reject(error.message)
  }
)
const {dispatch} = store
const reject = ({code,message})=>{
  if(code===403002){
    invalidToken()
  }
  Toast.show({content:message|| 'error'})
}
const invalidToken = ()=>{
  dispatch(setLoginForm({}))
  dispatch(setUserToken(''))
  getAuth().then((res)=>{
    const auth = store.getState().user.auth;
    console.log(res.data,auth)
    if(res.data===auth){
      window.onload();
    }else{
      openLoginPage()
    }
  })
}
export default request