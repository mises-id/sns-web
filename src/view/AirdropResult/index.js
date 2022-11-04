/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-11-04 18:40:53
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import Navbar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { getAirdropInfo, getTwitterAuth } from "@/api/user";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button } from "antd-mobile";
import { shortenAddress } from "@/utils";
import { useSelector } from "react-redux";
const AirdropResult = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const  [status, setStatus] = useState(''); // success, fail , unauth
  const [airdropInfo,setAirdropInfo] = useState({})
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    // code : 0 1 2
    switch (search.get('code')) {
      case '0': // waiting for server
        setStatus('success')
        break;
      case '1': // account failed 
        getAirdropInfo().then(res=>{
          setAirdropInfo(res.twitter || {
            username: search.get('username'),
            misesid: search.get('misesid'),
          })
          setStatus(setViewStatus(search,res))
        })
        break;
      case '2': // un auth
        setStatus('unauth')
        break;
      default:
        setStatus('success')
        break;
    }
    // eslint-disable-next-line
  }, [])
  const setViewStatus = (search,res)=>{
    if(res.airdrop && res.airdrop.status==='success'){
      return 'gotMIS'
    }
    if(res.airdrop){
      return 'unGotMIS'
    }
    if(res.twitter&&res.twitter.followers_count===0){
      return 'followers_countError'
    }
    if(res.twitter&&res.twitter.amount>0){
      return 'success'
    }
    if(search.get('code')==='1'){
      return 'fail'
    }
    return 'timeFail'
  }
  const history = useHistory()
  const customBack = () => {
    history.replace('/home/me')
  }
  // const [getValue, setValue] = useState('')
  const [loading,setLoading] = useState(false)
  const getAuth = () => {
    setLoading(true)
    getTwitterAuth()
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((err) => {
        console.log(err);
      }).finally(()=>{
        setLoading(false)
      });
  };
  const statusTxt = ()=>{
    const statusObj = {
      'fail': 'This Twitter account has been verified with another Mises ID',
      'timeFail': 'This Account was created after May. 1, 2022',
      'followers_countError': 'Your Twitter account does not meet the requirements',
      'unauth': 'Sorry, you canceled the authorization!',
      'gotMIS': 'This Twitter Account has got the MIS Airdrop, Thanks for your support!',
      'unGotMIS': 'You have successfully claimed your MIS Airdrop, Airdroping could take a few minutes.'
    }
    if(statusObj[status]){
      return statusObj[status];
    }
    return statusObj['unauth']
  }
  const selector = useSelector(state => state.user) || {};
  const misesid = (airdropInfo?.misesid || selector.loginForm?.misesid || '').replace('did:mises:','')
  const unEditText = `I have claimed $MIS airdrop by using Mises Browser @Mises001, which supports Web3 sites and extensions on mobile.<br/><br/>https://www.mises.site/download?MisesID=${misesid}<br/><br/>#Mises #Browser #web3 #extension`
  return (
    <>
      <Navbar title={t('airdropPageTitle')} customBack={customBack}/>
      <div className="m-layout airdrop-content" style={{backgroundImage:'url(/static/images/airdrop-bg.png)'}}>
        <div className="airdrop-box">
          <div className="listItem">
            <span className="label">Mises ID:</span>
            <span className="value">{shortenAddress(misesid)}</span>
          </div>
          <div className="listItem">
            <span className="label">Twitter ID:</span>
            <span className="value">{airdropInfo.username || airdropInfo.twitter_user_id ||'NULL'}</span>
          </div>

          {status==='success'&&<>
            <p className="text-bold success-tips">Your airdrop is in process</p>
            <p className="text-bold success-tips">We'll send MIS airdrops according to your Twitter data</p>
            <p className="twitter-tips">You will automatically follow @Mises001 and send the following tweet to claim the airdrop</p>
            <div className="text-area">
              <p className="font-14 tweet">
                You can check the airdrop status anytime on the Airdrop page
              </p>
              <p className="font-14 tweet" dangerouslySetInnerHTML={{__html:unEditText}}></p>
            </div>
            <Button 
              className="btn" 
              fill='solid' 
              color='primary'
              onClick={customBack}>
              <span>Confirm</span>
            </Button>
          </>}

          {status!=='success'&&status!==''&&<>
            {!['gotMIS','unGotMIS'].includes(status) ? <>
            {status!=='unauth'&&<p className="fail-reason">Your account does not meet the requirements</p>}
            <p className="fail-reason">
            {status!=='unauth'&&<span>Reason:</span>} {statusTxt()}
            </p></> : <p className="get-airdrop-reason">{statusTxt()}</p>}
            
            <Button 
              className="btn-fail" 
              fill='outline' 
              color='primary'
              loading={loading}
              onClick={getAuth}>
              <span>Change Twitter</span>
            </Button>
          </>}
        </div>
      </div>
    </>
  );
};
export default AirdropResult;
