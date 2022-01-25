/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2022-01-25 23:52:06
 * @LastEditors: lmk
 * @Description: to extension
 */

import Web3 from 'web3'
import {urlToJson} from "./";
import { setFollowingBadge, setLoginForm, setUserAuth, setUserToken } from '@/actions/user';
import { store } from "@/stores";
import { signin } from '@/api/user';
import { clearCache,dropByCacheKey,getCachingKeys,refreshByCacheKey } from 'react-router-cache-route'
import { Modal } from 'zarm';
window.clearCache = clearCache;
window.dropByCacheKey = dropByCacheKey;
window.getCachingKeys = getCachingKeys;
window.refreshByCacheKey = refreshByCacheKey;
export default class MisesExtensionController{
  web3;
  appid = "did:misesapp:mises1v49dju9vdqy09zx7hlsksf0u7ag5mj4579mtsk"; // prod
  // timer;
  // getMax = 3;
  // getNum = 0;
  // appid = "did:misesapp:mises1g3atpp5nlrzgqkzd4qfuzrdfkn8vy0a4jepr2t"; // dev
  constructor (){
    this.init()
    this.listen()
  }
  // getProvider(){
  //   console.log(this.getNum,Web3.givenProvider);
  //   if(this.getNum===this.getMax){
  //     this.clear()
  //     return false;
  //   }
  //   if(Web3.givenProvider&&Web3.givenProvider.chainId){
  //     this.init()
  //     this.clear()
  //     return false
  //   }
  //   this.getNum++
  //   this.timer = setTimeout(() => {
  //     this.getProvider()
  //   }, 300);
  // }
  // clear(){
  //   clearTimeout(this.timer)
  //   this.timer = null;
  //   this.getNum = 0;
  // }
  init (){
    if(!window.ethereum) {
      console.log('unInit')
      return Promise.reject();
    }
    if(this.web3){
      return Promise.resolve()
    }
    console.log('init')
    this.web3 = new Web3(window.ethereum || "ws://localhost:8545");
    console.log(window.ethereum)
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
    
    // If the initialization is completed, the currently selected account will be obtained
    setTimeout(() => {
      const {selectedAddress} = window.ethereum
      if(selectedAddress){
        this.resetAccount(selectedAddress)
        return false;
      }
      if(!selectedAddress){
        console.log('not find selectedAddress');
        this.resetApp()
      }
    }, 150);
    return Promise.resolve()
  }
  listen(){
    if(!window.ethereum){
      return false;
    }
    window.ethereum.on('accountsChanged',async res=>{
      console.log(res);
      if(res.length){
        this.resetAccount(res[0])
      }
      if(res.length===0) {
        this.resetApp()
      }
    })
    window.ethereum.request({ method: 'eth_accounts' }).then(res=>{
      console.log(313123333,res);
      if(res.length===0){
        this.resetApp()
      }
    })
    window.ethereum.on('chainChanged',res=>{
      console.log(res)
    })
    window.ethereum.on('restoreAccount',res=>{
      console.log(res,'restoreAccount')
    })
  }
  resetApp(){
    console.log('resetApp')
    setTimeout(() => {
      store.dispatch(setUserAuth(''))
      this.resetUser()
      store.dispatch(setUserToken(''))
      store.dispatch(setLoginForm({}))  
    }, 0);
  }
  async resetAccount(res){
    const misesid = await this.web3.misesWeb3.getAddressToMisesId(res);
    const {loginForm} = store.getState().user
    console.log(misesid,res);
    // If the selected user is different from the current user
    if(loginForm.misesid&&loginForm.misesid.indexOf(misesid)===-1){
      this.disconnect(loginForm.uid);
      this.resetUser()
      await this.requestAccounts()
      console.log(window.location.pathname)
      refreshByCacheKey(window.location.pathname)
      return false
    }
    if(!loginForm.misesid){
      await this.requestAccounts()
      refreshByCacheKey(window.location.pathname)
    }
  }
  async isInitMetaMask(showToast=true){
    if(!window.ethereum){
      return this.isUnInitMetaMask()
    }
    console.log(window.ethereum);
    return Boolean(window.ethereum) ? Promise.resolve(true) : (this.isUnInitMetaMask())
  }
  isUnInitMetaMask(){
    Modal.confirm({
      title: 'Message',
      content:'Failed to connect with metamask, request to refresh again',
      onCancel: () => {},
      onOk: () => {
        window.location.reload()
      },
    });
    return Promise.resolve(false)
  }
  resetUser(){
    // store.dispatch(setUserAuth(''))
    // store.dispatch(setUserToken(''))
    // store.dispatch(setLoginForm({}))
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
      console.log(error);
      return Promise.reject(error)
    }
  }
  async getAuth(){
    console.log('getAuth')
    try {
      const flag = await this.isInitMetaMask();
      if(!flag) return Promise.reject()
      await this.init()
      const res = await this.web3.misesWeb3.requestAccounts();
      const {mises_id} = urlToJson(`?${res.auth}`);
      await this.connect(mises_id)
      return {
        ...res,
        mises_id
      }
    } catch (error) {
      return Promise.reject(error)
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
    const flag = await this.isInitMetaMask();
    if(!flag) return Promise.reject()
    await this.init()
    this.web3.misesWeb3.openRestore()
  }
  async getMisesAccounts(){
    console.log('getMisesAccounts')
    try {
      // const flag = await this.isInitMetaMask();
      // if(!flag) return Promise.reject()
      if(!this.web3) return Promise.reject('uninit')
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
      const flag = await this.isInitMetaMask();
      if(!flag) return Promise.reject()
      await this.init()
      const getActive = await this.web3.misesWeb3.getActive();
      // const selectedAddress = Boolean(this.web3.currentProvider.selectedAddress);
      return getActive ? Promise.resolve(true) : Promise.reject('Wallet not activated')
    } catch (error) {
      console.log(error,'isActive')
      return Promise.reject(error || 'Wallet not activated')
    }
  }
}
