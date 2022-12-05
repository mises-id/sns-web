/*
 * @Author: lmk
 * @Date: 2021-07-19 22:38:14
 * @LastEditTime: 2022-10-27 11:51:25
 * @LastEditors: lmk
 * @Description: to extension
 */

import {
  isMisesBrowser,
} from "./";
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
  appid = "did:misesapp:mises1v49dju9vdqy09zx7hlsksf0u7ag5mj4579mtsk"; // prod
  // appid = "did:misesapp:mises1g3atpp5nlrzgqkzd4qfuzrdfkn8vy0a4jepr2t"; // dev
  constructor() {
    setTimeout(() => {
      this.getProvider().then(()=>{
        store.dispatch(setWeb3Init(true));
        this.initAccount()
        this.listen()
      }).catch(()=>{
        store.dispatch(setWeb3ProviderMaxFlag(false));

      })
    }, 10);
  }

  async getProvider() {
    if (window.keplr) {
      return window.keplr;
    }

    if (document.readyState === "complete") {
      return window.keplr;
    }

    return new Promise((resolve,reject) => {
      const documentStateChange = (event) => {
        if (event.target && event.target.readyState === "complete") {
          window.keplr ? resolve(window.keplr) : reject();
          console.log(window.keplr)
          document.removeEventListener("readystatechange", documentStateChange);
        }
      };

      document.addEventListener("readystatechange", documentStateChange);
    });
  }


  async initAccount() {
    const provider = await this.getProvider()
    const isUnlocked = await provider.isunlocked()
    const { loginForm = {} } = store.getState().user;

    if(isUnlocked && !loginForm.uid){
      this.requestAccounts()
    }

  }

  async listen() {
    const provider = await this.getProvider()
    window.addEventListener("keplr_keystorechange", () => {
      console.log("Key store in Keplr is changed. You may need to refetch the account info.")
      const offlineSigner = provider.getOfflineSigner?.('mainnet');
      if(offlineSigner){
        offlineSigner.getAccounts().then((res)=>{
          const [account] = res;
          this.resetAccount(account)
        });
      }
    })
  }

  async misesWeb3Client(){
    const provider = await this.getProvider();
    return provider.misesWeb3Client()
  }

  async resetAccount(address) {
    console.log("resetAccount");

    const { loginForm } = store.getState().user;

    if (loginForm.misesid !== address) {
      await this.disconnect(loginForm.uid);
      this.resetUser();
    }

    return this.requestAccounts();
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
      content: "Failed to connect with Mises Wallet, request to refresh again",
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

  async connect(userid) {
    const misesWeb3Client = await this.misesWeb3Client()
    return misesWeb3Client.connect({
      domain: "mises.site", //
      appid: this.appid,
      userid,
      permissions: [],
    });
  }

  async disconnect(userid) {
    console.log("disconnect");
    const misesWeb3Client = await this.misesWeb3Client()

    return misesWeb3Client.disconnect({ appid: this.appid, userid });
  }

  async requestAccounts() {
    console.log("requestAccounts");
    try {
      const res = await this.getAuth();

      store.dispatch(setUserAuth(res.auth));

      const data = await signin({
        provider: "mises",
        user_authz: { auth: res.auth },
      });

      if (data.token) {
        store.dispatch(setUserToken(data.token));
        await this.getUserInfo(data.token);
        const uid = localStorage.getItem("uid");
        this.connect(uid)
      }

      return Promise.resolve();
    } catch (error) {
      if (error && error.code === 4001) {
        window.location.reload();
      }
      console.log(error);

      return Promise.reject(error);
    }
  }

  async getUserInfo(token) {
    try {
      const res = await getUserSelfInfo(null, {
        Authorization: `Bearer ${token}`,
      });

      store.dispatch(setLoginForm(res));
      localStorage.setItem("uid", res.uid);

      setTimeout(() => {
        if (
          !res.is_logined &&
          window.history.location?.pathname !== "airdrop"
        ) {
          window.history.push("/airdrop");
          store.dispatch(setFirstLogin(true));
        }
      }, 100);

      return Promise.resolve();
    } catch (error) {
      // Toast.show('user/me接口出错了')
      return Promise.reject("user/me接口出错了");
    }
  }

  async getAuth() {
    console.log("getAuth");
    try {
      const provider = await this.getProvider();

      await provider.enable('mainnet');

      const result = await provider.misesAccount()

      return {
        mises_id: result.address,
        ...result
      }
    } catch (error) {
      console.log(error)
      throw new Error('Not found account')
    }
  }

  async setUserInfo(data) {
    console.log("setUserInfo");
    try {
      await this.isActive()

      const misesWeb3Client = await this.misesWeb3Client()
      await misesWeb3Client.setUserInfo(data);
      
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async userFollow(data) {
    try {
      console.log("userFollow");
      
      const misesWeb3Client = await this.misesWeb3Client()
      await misesWeb3Client.userFollow(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async userUnFollow(data) {
    try {
      const misesWeb3Client = await this.misesWeb3Client()
      await misesWeb3Client.userUnFollow(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async openWallet() {
    console.log("openWallet");
    const misesWeb3Client = await this.misesWeb3Client()
    misesWeb3Client.openWallet();
  }

  async getMisesAccounts() {
    console.log("getMisesAccounts");
    try {
      const misesWeb3Client = await this.misesWeb3Client()

      return await misesWeb3Client.hasWalletAccount();

    } catch (error) {
      console.log(error, "getMisesAccounts");
      return Promise.reject(error || "con't find accounts");
    }
  }
  
  async isActive() {
    const provider = await this.getProvider()
    const isunlocked = await provider.isunlocked();
    return isunlocked ? Promise.resolve() : Promise.reject('Wallet not activated')
  }
}
