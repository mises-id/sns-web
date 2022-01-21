/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2022-01-20 18:51:19
 * @LastEditors: lmk
 * @Description: to extension
 */

import Web3 from 'web3'
import {urlToJson} from "./";
import { setFollowingBadge, setLoginForm, setUserAuth, setUserToken } from '@/actions/user';
import { store } from "@/stores";
import { signin } from '@/api/user';
import { clearCache,dropByCacheKey,getCachingKeys,refreshByCacheKey } from 'react-router-cache-route'
import { Toast } from 'zarm';
window.clearCache = clearCache;
window.dropByCacheKey = dropByCacheKey;
window.getCachingKeys = getCachingKeys;
window.refreshByCacheKey = refreshByCacheKey;
export default class MisesExtensionController{
  web3;
  appid = "did:misesapp:mises1v49dju9vdqy09zx7hlsksf0u7ag5mj4579mtsk"; // prod
  // appid = "did:misesapp:mises1g3atpp5nlrzgqkzd4qfuzrdfkn8vy0a4jepr2t"; // dev
  constructor (){
    this.init()
    console.log('init')
  }
  init (){
    this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    console.log(Web3.givenProvider)
    this.web3.extend({
      property: 'misesWeb3',
      methods:[{
        name:'requestAccounts',
        call: 'mises_requestAccounts'
      },{
        name:'setUserInfo',
        call: 'mises_setUserInfo',
        params: 1,
		    inputFormatter: [null]
      },{
        name:'userFollow',
        call: 'mises_userFollow',
        params: 1,
		    inputFormatter: [null]
      },{
        name:'userUnFollow',
        call: 'mises_userUnFollow',
        params: 1,
		    inputFormatter: [null]
      },{
        name:'getMisesAccounts',
        call: 'mises_getMisesAccount'
      },{
        name:'openRestore',
        call: 'mises_openRestore'
      },{
        name:'getActive',
        call: 'mises_getActive'
      },{
        name:'connect',
        call: 'mises_connect',
        params: 1,
		    inputFormatter: [null]
      },{
        name:'disconnect',
        call: 'mises_disconnect',
        params: 1,
		    inputFormatter: [null]
      },{
        name:'getAddressToMisesId',
        call: 'mises_getAddressToMisesId',
        params: 1,
		    inputFormatter: [null]
      }]
    })
    if(window.ethereum){
      window.ethereum.on('accountsChanged',async res=>{
        if(res.length){
          const misesid = await this.web3.misesWeb3.getAddressToMisesId(res[0]);
          const {loginForm} = store.getState().user
          if(loginForm.misesid&&loginForm.misesid.indexOf(misesid)===-1){
            this.disconnect(loginForm.uid);
            this.resetUser()
            await this.requestAccounts()
            console.log(window.location.pathname)
            refreshByCacheKey(window.location.pathname)
          }
        }
        if(res.length===0) {
          this.resetUser()
          // const accountRes = await this.web3.misesWeb3.requestAccounts();
          // store.dispatch(setUserAuth(accountRes.auth))
        }
      })
      window.ethereum.on('chainChanged',res=>{
        console.log(res)
      })
    }
    
  }
  async isInitMetaMask(){
    console.log(Web3.givenProvider);
    return !!Web3.givenProvider&&Web3.givenProvider.chainId ? Promise.resolve(true) : (Toast.show('cannot find metamask'),Promise.reject('cannot find metamask'))
  }
  resetUser(){
    store.dispatch(setUserAuth(''))
    store.dispatch(setUserToken(''))
    store.dispatch(setLoginForm({}))
    store.dispatch(setFollowingBadge({
      total:0,
      notifications_count:0
    }))
    clearCache()
    // dropByCacheKey('/home/discover')
    // dropByCacheKey('/home/following')
    console.log('resetUser')
  }
  connect(userid){
    console.log('connect')
    return this.web3.misesWeb3.connect({
      domain: 'mises.site', //
      appid:this.appid,
      userid,
      permissions:[]
    })
  }
  disconnect(userid){
    console.log('disconnect')
    return this.web3.misesWeb3.disconnect({appid:this.appid,userid})
  }
  async requestAccounts(){
    console.log('requestAccounts')
    try {
      const res = await this.getAuth();
      // const nonce = new Date().getTime();
      // const sign = res.mises_id+nonce;
      // await this.web3.eth.personal.sign(sign,res.accounts[0]) // show sign pop 
      store.dispatch(setUserAuth(res.auth))
      const data = await signin({
        "provider": "mises",
        "user_authz": {auth:res.auth}
      })
      data.token&&store.dispatch(setUserToken(data.token))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getAuth(){
    console.log('getAuth')
    await this.isInitMetaMask()
    const res = await this.web3.misesWeb3.requestAccounts();
    const {mises_id} = urlToJson(`?${res.auth}`);
    await this.connect(mises_id)
    return {
      ...res,
      mises_id
    }
  }
  async setUserInfo(data){
    console.log('setUserInfo')
    try {
      await this.isActive()
      await this.web3.misesWeb3.setUserInfo(data)
    } catch (error) {
      this.requestAccounts()
    }
  }
  async userFollow(data){
    console.log('userFollow')
    this.web3.misesWeb3.userFollow(data)
  }
  async userUnFollow(data){
    console.log('userUnFollow')
    this.web3.misesWeb3.userUnFollow(data)
  }
  async openRestore(){
    console.log('openRestore')
    await this.isInitMetaMask()
    this.web3.misesWeb3.openRestore()
  }
  async getMisesAccounts(){
    console.log('getMisesAccounts')
    try {
      await this.isActive()
      const count = await this.web3.misesWeb3.getMisesAccounts()
      return count
    } catch (error) {
      // this.requestAccounts()
      return Promise.reject(error)
    }
  }
  async isActive(){
    console.log('isActive')
    try {
      await this.isInitMetaMask()
      const flag = await this.web3.misesWeb3.getActive();
      return flag ? Promise.resolve(true) : Promise.reject('Wallet not activated')
    } catch (error) {
      console.log(error,'isActive')
      return Promise.reject(error || 'Wallet not activated')
    }
  }
}
