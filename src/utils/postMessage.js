/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2022-08-31 15:42:22
 * @LastEditors: lmk
 * @Description: to extension
 */

import Web3 from "web3";
import { isIos, isIosPlatform, isMisesBrowser, urlToJson } from "./";
import {
  setFirstLogin,
  setFollowingBadge,
  setLoginForm,
  // setLoginForm,
  setUserAuth,
  setUserToken,
  setWeb3Init,
  setWeb3ProviderMaxFlag,
} from "@/actions/user";
import { store } from "@/stores";
import { getUserSelfInfo, signin } from "@/api/user";
import {
  clearCache,
  dropByCacheKey,
  getCachingKeys,
  refreshByCacheKey,
} from "react-router-cache-route";
import { Modal } from "zarm";
import { setVisibility } from "@/actions/app";
// import { Toast } from "antd-mobile";
window.clearCache = clearCache;
window.dropByCacheKey = dropByCacheKey;
window.getCachingKeys = getCachingKeys;
window.refreshByCacheKey = refreshByCacheKey;
export default class MisesExtensionController {
  web3;
  appid = "did:misesapp:mises1v49dju9vdqy09zx7hlsksf0u7ag5mj4579mtsk"; // prod
  timer;
  startNum = 10000;
  getMax = 10;
  getNum = 0;
  switchNetworkLoading = false;
  isConnect = false;
  connectStatus = 'complete'
  // appid = "did:misesapp:mises1g3atpp5nlrzgqkzd4qfuzrdfkn8vy0a4jepr2t"; // dev
  constructor() {
    setTimeout(() => {
      this.getProvider();
    }, 10);
  }

  getProvider() {
    console.log(this.getNum, window.ethereum);
    if (this.getNum === this.getMax) {
      this.clear();
      store.dispatch(setWeb3ProviderMaxFlag(false));
      return false;
    }
    if (window.ethereum && window.ethereum.chainId) {
      this.init();
      this.listen();
      this.clear();
      return false;
    }
    this.getNum++;
    this.timer = setTimeout(() => {
      this.getProvider();
    }, 500);
  }

  clear() {
    clearTimeout(this.timer);
    this.timer = null;
    this.startNum = 10000;
  }

  init() {
    if (!window.ethereum) {
      console.log("unInit");
      this.resetApp();
      return Promise.reject();
    }
    if (this.web3) {
      store.dispatch(setWeb3Init(true));
      return Promise.resolve();
    }
    console.log("init");
    const matamaskProvider = !window.ethereum.providers ? window.ethereum : this.getMetamaskProvider();
    this.web3 = new Web3( matamaskProvider || "ws://localhost:8545");
    this.web3.extend({
      property: "misesWeb3",
      methods: [
        {
          name: "requestAccounts",
          call: "mises_requestAccounts",
        },
        {
          name: "setUserInfo",
          call: "mises_setUserInfo",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "userFollow",
          call: "mises_userFollow",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "userUnFollow",
          call: "mises_userUnFollow",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "getMisesAccounts",
          call: "mises_getMisesAccount",
        },
        {
          name: "openRestore",
          call: "mises_openRestore",
        },
        {
          name: "openNFTPage",
          call: "mises_openNFTPage",
        },
        {
          name: "getActive",
          call: "mises_getActive",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "connect",
          call: "mises_connect",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "disconnect",
          call: "mises_disconnect",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "getAddressToMisesId",
          call: "mises_getAddressToMisesId",
          params: 1,
          inputFormatter: [null],
        },
        {
          name: "getCollectibles",
          call: "mises_getCollectibles",
        },
      ],
    });
    store.dispatch(setWeb3Init(true));
    return Promise.resolve();
  }
  getMetamaskProvider(){
    const providerMap = window.ethereum.providerMap;
    return providerMap.get("MetaMask")
  }
  listen() {
    if (!window.ethereum) {
      return false;
    }
    window.ethereum.on("accountsChanged", async (res) => {
      if (res.length) {
        console.log('accountsChanged',res, this.connectStatus, this.isConnect)
        if(this.isConnect && this.connectStatus === 'complete'){
          await this.resetAccount(res[0]);
        }else{
          console.log('is first')
        }
      }else{
        console.log(res.length, res, 'accountsChanged')
        setTimeout(() => {
          this.checkedHasAccount();
        }, 100);
      }
    });
   
    window.ethereum.request({ method: "eth_accounts" }).then((res) => {
      if(isIosPlatform()){
        const ethAddress = localStorage.getItem('ethAddress');
        this.isConnect = !!ethAddress;
        if (res.length > 0 && ethAddress !== res[0]) {
          this.resetAccount(res[0]);
        }
      }else{
        if (res.length > 0) {
          console.log("eth_accounts");
          this.resetAccount(res[0]);
          return false;
        }
        /**
         * @description: 
            Case 1: if the connected account list is empty and unlocked, it means that no account is connected to the website, and the existing local user data needs to be cleared
  
            Case 2: if the list of connected accounts in the locked state is empty, the existing local user data will not be processed
        */
        res.length === 0 &&
          this.isActive('eth_accounts')
            .then((res) => {
              console.log("not find selectedAddress");
              this.resetApp();
            })
            .catch((err) => {
              console.log(err);
            });
      }
    });
    
    window.ethereum.on("chainChanged", (res) => {
      console.log(res);
    });

    this.checkedHasAccount();
  }
  checkedHasAccount(){
    this.getMisesAccounts().then(res=>{
      const { loginForm={} } = store.getState().user;
      console.log(res,loginForm.uid)
      if(!res && loginForm.uid){
        console.log('check has wallet account')
        store.dispatch(setUserAuth(''));
        store.dispatch(setUserToken(''));
        store.dispatch(setLoginForm({}));
        store.dispatch(setWeb3Init(false));
        setTimeout(() => {
          store.dispatch(setWeb3Init(true));
        }, 200);
      }
    }).catch(error=>{
      console.log(error, 'getMisesAccounts')
    })
   
  }
  resetApp() {
    const { loginForm } = store.getState().user;
    if (loginForm.misesid) {
      console.log("resetApp");
      setTimeout(() => {
        this.resetUser();
      }, 0);
    }
  }

  async resetAccount(ethAddress) {
    console.log("resetAccount");
    // console.time("getAddressToMisesId time");
    // const misesid = await this.web3.misesWeb3.getAddressToMisesId(res);
    // console.timeEnd("getAddressToMisesId time");
    const storageEthAddress = localStorage.getItem('ethAddress');
    const { loginForm } = store.getState().user;
    // If the selected user is different from the current user
    if (loginForm.misesid && storageEthAddress!==ethAddress) {
      this.disconnect(loginForm.uid);
      this.resetUser();
    }
    return this.requestAccounts();
    // refreshByCacheKey(window.location.pathname)
    // this.connect(loginForm.misesid)
  }
  async isInitMetaMask(hideModal) {
    if (!window.ethereum && !hideModal) {
      return this.isUnInitMetaMask();
    }
    if (window.ethereum && !window.ethereum.chainId && !hideModal) {
      return this.isUnInitMetaMask();
    }
    return window.ethereum && Boolean(window.ethereum.chainId)
      ? Promise.resolve(true)
      : !hideModal && this.isUnInitMetaMask();
  }

  isUnInitMetaMask() {
    //
    if (!isMisesBrowser()) {
      store.dispatch(setVisibility(true));
      return false;
    }
    Modal.confirm({
      title: "Message",
      width: "83%",
      content: "Failed to connect with metamask, request to refresh again",
      onCancel: () => {},
      onOk: () => {
        window.location.reload();
      },
    });
    return Promise.resolve(false);
  }

  resetUser() {
    store.dispatch(
      setFollowingBadge({
        total: 0,
        notifications_count: 0,
      })
    );
    // refreshByCacheKey('/home')
    clearCache();
    console.log("resetUser");
  }

  connect(userid) {
    return this.web3.misesWeb3.connect({
      domain: "mises.site", //
      appid: this.appid,
      userid,
      permissions: [],
    });
  }

  // getcollectibles
  getCollectibles() {
    return this.web3.misesWeb3.getCollectibles();
  }

  disconnect(userid) {
    console.log("disconnect");
    return this.web3.misesWeb3.disconnect({ appid: this.appid, userid });
  }

  async requestAccounts() {
    console.log("requestAccounts");
    try {
      this.connectStatus = 'loading'
      console.time("requestAccounts time");
      const res = await this.getAuth();
      console.timeEnd("requestAccounts time");
      // const nonce = new Date().getTime();
      // const sign = res.mises_id+nonce;
      // await this.web3.eth.personal.sign(sign,res.accounts[0]) // show sign pop
      store.dispatch(setUserAuth(res.auth));
      localStorage.setItem('ethAddress',res.address)
      console.time("signin time");
      const data = await signin({
        provider: "mises",
        user_authz: { auth: res.auth },
      });
      this.connectStatus = 'complete'
      console.timeEnd("signin time");
      if(data.token){
        store.dispatch(setUserToken(data.token));
        await this.getUserInfo(data.token)
      }
      return Promise.resolve();
    } catch (error) {
      if (error && error.code === 4001) {
        window.location.reload();
      }
      this.connectStatus = 'complete'
      console.log(error);
      // Toast.show('signin接口出错了')
      return Promise.reject(error);
    }
  }
  async getUserInfo(token){
    try {
      const res = await  getUserSelfInfo(null, {
        Authorization: `Bearer ${token}`
      })
      console.log(res);
      store.dispatch(setLoginForm(res));
      localStorage.setItem("uid", res.uid);
      setTimeout(() => {
        if (!res.is_logined && window.history.location?.pathname !== "airdrop") {
          window.history.push("/airdrop");
          store.dispatch(setFirstLogin(true));
        }
      }, 100);
      return Promise.resolve()
    } catch (error) {
      // Toast.show('user/me接口出错了')
      return Promise.reject('user/me接口出错了')
    }
  }
  async getAuth() {
    console.log("getAuth");
    try {
      const flag = await this.isInitMetaMask();
      if (!flag) return Promise.reject();
      await this.init();
      const res = await this.web3.misesWeb3.requestAccounts();
      const { mises_id } = urlToJson(`?${res.auth}`);
      await this.connect(mises_id);
      this.isConnect = true;
      return {
        ...res,
        mises_id,
        address: res.accounts[0]
      };
    } catch (error) {
      this.isConnect = false;
      return Promise.reject(error);
    }
  }

  async setUserInfo(data) {
    console.log("setUserInfo");
    try {
      await this.isActive('setUserInfo');
      await this.web3.misesWeb3.setUserInfo(data);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async userFollow(data) {
    try {
      console.log("userFollow");
      const flag = await this.isInitMetaMask();
      if (!flag) return Promise.reject();
      await this.init();
      this.web3.misesWeb3.userFollow(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async userUnFollow(data) {
    try {
      console.log("userUnFollow");
      const flag = await this.isInitMetaMask();
      if (!flag) return Promise.reject();
      await this.init();
      this.web3.misesWeb3.userUnFollow(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async openRestore() {
    console.log("openRestore");
    const flag = await this.isInitMetaMask();
    if (!flag) return Promise.reject();
    await this.init();
    this.web3.misesWeb3.openRestore();
  }

  async getMisesAccounts(showModal) {
    console.log("getMisesAccounts");
    try {
      // const flag = await this.isInitMetaMask();
      // if(!flag) return Promise.reject()
      const flag = await this.isInitMetaMask(showModal);
      if (!flag) return Promise.reject('Please install MetaMask');
      await this.init();
      const count = await this.web3.misesWeb3.getMisesAccounts();
      return count;
    } catch (error) {
      console.log(error,'getMisesAccounts')
      return Promise.reject(error || 'con\'t find accounts');
    }
  }
  getCurrentProvider(){
    const metamaskProvider = this.web3.currentProvider
    return metamaskProvider
  }
  async isActive(source) {
    console.log("isActive",source);
    try {
      const flag = await this.isInitMetaMask();
      if (!flag) return Promise.reject();
      await this.init();
      const { loginForm } = store.getState().user;
      console.log(this.connectStatus)
      const metamaskProvider = this.getCurrentProvider();
      const getActive = isIos() ?  await this.web3.misesWeb3.getActive(loginForm.misesid) : metamaskProvider._state.isUnlocked;
      console.log(getActive,'getActive')
      return getActive
        ? Promise.resolve(true)
        : Promise.reject("Wallet not activated");
    } catch (error) {
      console.log(error, "isActive");
      return Promise.reject(error || "Wallet not activated");
    }
  }
  // get metamask version
  getMetamaskVersion() {
    if(window.misesModule&&window.misesModule.getMetamaskVersion){
      return window.misesModule.getMetamaskVersion()
    }
    if(isIos()){
      return true
    }
    return ''
  }

  async NFTPage() {
    const flag = await this.isInitMetaMask();
    if (!flag) return Promise.reject();
    await this.init();
    console.log(window.ethereum)
    if(window.ethereum.chainId!=='0x1'){
      Modal.confirm({
        title: "Message",
        width: "83%",
        content: "Please switch to mainnet",
        onOk: () => {
          this.switchChianNetwork().then(()=>{
            setTimeout(() => {
              this.web3.misesWeb3.openNFTPage();
            }, 0);
          })
        },
      });
      return
    }
    this.web3.misesWeb3.openNFTPage();
  }

  switchChianNetwork() {
    return window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{
        chainId: "0x1",
      }],
    })
  }
}
