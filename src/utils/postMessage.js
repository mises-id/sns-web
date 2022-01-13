/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2022-01-13 17:22:40
 * @LastEditors: lmk
 * @Description: to extension
 */

import Web3 from 'web3'
import {urlToJson} from "./";
import { setLoginForm, setUserAuth, setUserToken } from '@/actions/user';
import { store } from "@/stores";
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
      }]
    })
    if(window.ethereum){
      window.ethereum.on('accountsChanged',async res=>{
        if(res.length){
        }
        if(res.length===0) {
          await store.dispatch(setLoginForm({}))
          await store.dispatch(setUserAuth(''))
          await store.dispatch(setUserToken(''))
          // const accountRes = await this.web3.misesWeb3.requestAccounts();
          // store.dispatch(setUserAuth(accountRes.auth))
        }
      })
      window.ethereum.on('chainChanged',res=>{
        console.log(res)
      })
    }
    
  }
  connect(userid){
    return this.web3.misesWeb3.connect({
      domain: 'mises.site', //
      appid:this.appid,
      userid,
      permissions:[]
    })
  }
  disconnect(userid){
    return this.web3.misesWeb3.disconnect({appid:this.appid,userid})
  }
  async requestAccounts(){
    try {
      const res = await this.getAuth();
      // const nonce = new Date().getTime();
      // const sign = res.mises_id+nonce;
      // await this.web3.eth.personal.sign(sign,res.accounts[0]) // show sign pop 
      
      store.dispatch(setUserAuth(res.auth))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getAuth(){
    const res = await this.web3.misesWeb3.requestAccounts();
    const {mises_id} = urlToJson(`?${res.auth}`);
    const connect = await this.connect(mises_id)
    console.log(connect,'wqeweee')
    return {
      ...res,
      mises_id
    }
  }
  async setUserInfo(data){
    try {
      await this.isActive()
      await this.web3.misesWeb3.setUserInfo(data)
    } catch (error) {
      this.requestAccounts()
    }
  }
  async userFollow(data){
    this.web3.misesWeb3.userFollow(data)
  }
  async userUnFollow(data){
    this.web3.misesWeb3.userUnFollow(data)
  }
  openRestore(){
    this.web3.misesWeb3.openRestore()
  }
  async getMisesAccounts(){
    try {
      await this.isActive()
      const count = await this.web3.misesWeb3.getMisesAccounts()
      return count
    } catch (error) {
      // this.requestAccounts()
      return Promise.reject()
    }
  }
  async isActive(){
    const flag = await this.web3.misesWeb3.getActive();
    return flag ? Promise.resolve(true) : Promise.reject('not found active user')
  }
}
