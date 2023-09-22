/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2022-10-27 11:51:25
 * @LastEditors: lmk
 * @Description: to extension
 */

import { getProvider, isMisesBrowser } from "./";
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
import Web3 from "web3";
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
  connectStatus = 'complete';
  requestAccountPending = 0;
  // appid = "did:misesapp:mises1g3atpp5nlrzgqkzd4qfuzrdfkn8vy0a4jepr2t"; // dev
  constructor() {
    setTimeout(() => {
      this.getProvider();
    }, 10);
  }

  getProvider(flag) {
    const provider = getProvider();
    console.log(this.getNum, provider);
    if (this.getNum === this.getMax) {
      this.clear();
      store.dispatch(setWeb3ProviderMaxFlag(false));
      return false;
    }
    if (provider && provider.chainId) {
      if(!flag) {
        this.init();
        this.listen();
        this.clear();
      }
      
      return provider;
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
    const provider = getProvider();
    if (!provider) {
      console.log("unInit");
      this.resetApp();
      return Promise.reject();
    }

    store.dispatch(setWeb3Init(true));
    return Promise.resolve();
  }
  listen() {
    const provider = getProvider()
    if (!provider) {
      return false;
    }
    provider.on("accountsChanged", async (res) => {
      
      const ethAddress = localStorage.getItem('ethAddress') || '';
      this.isConnect = !!ethAddress;
      if (res.length > 0 && ethAddress.toLowerCase() !== res[0].toLowerCase()) {
        console.log(res, 'res')
        this.resetAccount(res[0]);
        this.requestAccountPending = 1;
        // this.requestAccounts()
      }
      if(res.length === 0) {
        this.cleanAccount()
      }
    });
    provider.request({ method: "eth_accounts" }).then((res) => {
      const ethAddress = localStorage.getItem('ethAddress') || '';
      this.isConnect = !!ethAddress;
      if (res.length > 0 && ethAddress.toLowerCase() !== res[0].toLowerCase()) {
        console.log(res, 'res')
        this.resetAccount(res[0]);
        this.requestAccounts()
      }
      // if(res.length === 0) {
      //   this.cleanAccount()
      // }
    });

    // this.cleanAccount();
  }
  cleanAccount(){
    const { loginForm={} } = store.getState().user;
    if(loginForm.uid){
      console.log('clean wallet account')
      store.dispatch(setUserAuth(''));
      store.dispatch(setUserToken(''));
      store.dispatch(setLoginForm({}));
      store.dispatch(setWeb3Init(false));
      store.dispatch(
        setFollowingBadge({
          total: 0,
          notifications_count: 0,
        })
      );
      setTimeout(() => {
        store.dispatch(setWeb3Init(true));
      }, 100);
    }
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
    const storageEthAddress = localStorage.getItem('ethAddress') || '';
    const { loginForm } = store.getState().user;
    // If the selected user is different from the current user
    if (loginForm.misesid && storageEthAddress.toLowerCase()!==ethAddress.toLowerCase()) {
      this.resetUser();
    }
    // return this.requestAccounts();
    // refreshByCacheKey(window.location.pathname)
    // this.connect(loginForm.misesid)
  }
  async isInitMetaMask(hideModal) {
    const provider = getProvider()
    if (!provider && !hideModal) {
      return this.isUnInitMetaMask();
    }
    if (provider && !provider.chainId && !hideModal) {
      return this.isUnInitMetaMask();
    }
    return provider && Boolean(provider.chainId)
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
    store.dispatch(setUserAuth(''));
    store.dispatch(setUserToken(''));
    store.dispatch(setLoginForm({}));
    store.dispatch(setWeb3Init(false));
    localStorage.removeItem('token');
    setTimeout(() => {
      store.dispatch(setWeb3Init(true));
    }, 200);
    console.log("resetUser");
  }

  connect(userid) {
    console.log(userid)
    // return this.web3.misesWeb3.connect({
    //   domain: "mises.site", //
    //   appid: this.appid,
    //   userid,
    //   permissions: [],
    // });
  }

  // getcollectibles
  getCollectibles() {
    // return this.web3.misesWeb3.getCollectibles();
  }

  disconnect() {
    console.log("disconnect");
    // return this.web3.misesWeb3.disconnect({ appid: this.appid, userid });
  }

  async requestAccounts() {
    console.log("requestAccounts");
    try {
      this.connectStatus = 'loading'
      const res = await this.getAuth();
      // const nonce = new Date().getTime();
      // const sign = res.mises_id+nonce;
      // await this.web3.eth.personal.sign(sign,res.accounts[0]) // show sign pop
      store.dispatch(setUserAuth(res.auth));
      localStorage.setItem('ethAddress',res.address)

      const data = await signin({
        provider: 'mises',
        user_authz: { auth: res.auth },
      });
      
      this.connectStatus = 'complete'
      if(data.token){
        store.dispatch(setUserToken(data.token));
        await this.getUserInfo(data.token)
      }
      this.requestAccountPending = 0;
      return Promise.resolve();
    } catch (error) {
      // if (error && error.code === 4001) {
      //   window.location.reload();
      // }
      console.log(111)
      this.connectStatus = 'complete'
      // Toast.show('signin接口出错了')
      return Promise.reject(error);
    }
  }
  async getUserInfo(token){
    try {
      const res = await  getUserSelfInfo(null, {
        Authorization: `Bearer ${token}`
      })
      store.dispatch(setLoginForm(res));
      localStorage.setItem("uid", res.uid);
      setTimeout(() => {
        if (!res.is_logined && window.history.location?.pathname !== "airdrop") {
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

      const provider = getProvider()

      const account = await provider.request({
        method: 'eth_requestAccounts',
        params: []
      })
      
      const timestamp = new Date().getTime();
      const address = Web3.utils.toChecksumAddress(account[0])
      const nonce = `${timestamp}`
      const sigMsg = `address=${address}&nonce=${nonce}`
      const {sig: personalSignMsg} = await provider.signMessageForAuth(address, nonce)
      // const personalSignMsg = await provider.request({
      //   method: 'personal_sign',
      //   params: [address, sigMsg]
      // })

      const auth = `${sigMsg}&sig=${personalSignMsg}`
      return {
        auth,
        address
      }

      // const res = await this.web3.misesWeb3.requestAccounts();
      // const { mises_id } = urlToJson(`?${res.auth}`);
      // await this.connect(mises_id);
      // this.isConnect = true;
      // return {
      //   ...res,
      //   mises_id,
      //   address: res.accounts[0]
      // };
    } catch (error) {
      this.isConnect = false;
      return Promise.reject(error);
    }
  }

  async setUserInfo(data) {
    console.log("setUserInfo");
    // try {
    //   await this.isActive('setUserInfo');
    //   await this.web3.misesWeb3.setUserInfo(data);
    //   return true;
    // } catch (error) {
    //   return Promise.reject(error);
    // }
  }

  async userFollow(data) {
    // try {
    //   console.log("userFollow");
    //   const flag = await this.isInitMetaMask();
    //   if (!flag) return Promise.reject();
    //   await this.init();
    //   await this.web3.misesWeb3.userFollow(data);
    // } catch (error) {
    //   console.log(error)
    // }
  }

  async userUnFollow(data) {
    // try {
    //   console.log("userUnFollow");
    //   const flag = await this.isInitMetaMask();
    //   if (!flag) return Promise.reject();
    //   await this.init();
    //   await this.web3.misesWeb3.userUnFollow(data);
    // } catch (error) {
    //   console.log(error)
    //   // return Promise.reject(error);
    // }
  }

  async openWallet() {
    console.log("openWallet");
    const flag = await this.isInitMetaMask();
    if (!flag) return Promise.reject();
    await this.init();
    // this.web3.misesWeb3.openRestore();
  }

  async getMisesAccounts(showModal) {
    console.log("getMisesAccounts");
    return true;
    // try {
    //   // const flag = await this.isInitMetaMask();
    //   // if(!flag) return Promise.reject()
    //   const flag = await this.isInitMetaMask(showModal);
    //   if (!flag) return Promise.reject('Please install MetaMask');
    //   await this.init();
    //   const count = await this.web3.misesWeb3.getMisesAccounts();
    //   return count;
    // } catch (error) {
    //   console.log(error,'getMisesAccounts')
    //   return Promise.reject(error || 'con\'t find accounts');
    // }
  }
  async isActive(source) {
    console.log("isActive",source);
    try {
      const flag = await this.isInitMetaMask();
      if (!flag) return Promise.reject();
      await this.init();
      console.log(this.connectStatus)
      const metamaskProvider = getProvider()
      const getActive = metamaskProvider._metamask.isUnlocked();
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
    return true
  }

  async NFTPage() {
    const flag = await this.isInitMetaMask();
    if (!flag) return Promise.reject();
    await this.init();
    const provider = getProvider()
    console.log(provider)
    if(provider.chainId!=='0x1'){
      Modal.confirm({
        title: "Message",
        width: "83%",
        content: "Please switch to mainnet",
        onOk: () => {
          this.switchChianNetwork().then(()=>{
            // setTimeout(() => {
            //   this.web3.misesWeb3.openNFTPage();
            // }, 0);
          })
        },
      });
      return
    }
    // this.web3.misesWeb3.openNFTPage();
  }

  switchChianNetwork() {
    const provider = getProvider()
    return provider.request({
      method: "wallet_switchEthereumChain",
      params: [{
        chainId: "0x1",
      }],
    })
  }
  
  misesWeb3Client(){
    return {
      hasWalletAccount: ()=> Promise.resolve(true)
    }
  }
  async enable(){
    return true;
  }
}
