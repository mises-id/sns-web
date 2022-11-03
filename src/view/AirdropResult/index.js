/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-11-03 17:08:01
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import Navbar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { getAirdropInfo, getAirdropReceive, getTwitterAuth } from "@/api/user";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Toast,Button } from "antd-mobile";
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
    if(search.get('code')!=='2'){
      getAirdropInfo().then(res=>{
        setAirdropInfo(res.twitter || {
          username:search.username,
          misesid:search.misesid,
        })
        setStatus(setViewStatus(search,res))
      })
    }
    if(search.get('code')==='2'){
      setStatus('unauth')
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
    if(res.twitter.followers_count===0){
      return 'followers_countError'
    }
    if(res.twitter.amount>0){
      return 'success'
    }
    if(search.get('code')==='1'){
      return 'fail'
    }
    // 
    return 'timeFail'
  }
  const history = useHistory()
  const customBack = () => {
    history.replace('/home/me')
  }
  // const [getValue, setValue] = useState('')
  const [loading,setLoading] = useState(false)
  const getAirdrop = () => {
    
    setLoading(true)
    getAirdropReceive({
      tweet: `${unEditText.replace(/<br\/>/g, '\n')}`
    }).then(res=>{
      Toast.show({
        content: 'Send Success',
        duration: 1500,
        afterClose: () => {
          const coin = airdropInfo?.amount
          history.replace(`/airdrop?isFrom=homePage&MIS=${coin}`)
        }
      })
    }).finally(()=>{
      setLoading(false)
    })
  }
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
      'fail': 'Account has been verified',
      'timeFail': 'This Account was created after May. 1, 2022',
      'followers_countError': 'Your Twitter account does not meet the requirements',
      'unauth': 'Sorry, you canceled the authorization!',
      'gotMIS': 'This Twitter Account has got the MIS Airdrop, Thanks for your support!',
      'unGotMIS': 'You have successfully claimed your MIS Airdrop, Airdroping could take a few minutes.'
    }
    if(statusObj[status]){
      return statusObj[status];
    }
    return 'Sorry, you canceled the authorization!'
  }
  const selector = useSelector(state => state.user) || {};
  const misesid = airdropInfo?.misesid || selector.loginForm?.misesid?.replace('did:mises:','')
  const unEditText = `I have claimed ${airdropInfo.amount} $MIS airdrop by using Mises Browser @Mises001, which supports Web3 sites and extensions on mobile.<br/><br/>https://www.mises.site/download?MisesID=${misesid}<br/><br/>#Mises #Browser #web3 #extension`
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
            <span className="value">{airdropInfo.username || 'NULL'}</span>
          </div>

          {status==='success'&&<>
            <div className="listItem">
              <span className="label">Available Airdrop:</span>
              <span className="value">{airdropInfo.amount}MIS</span>
            </div>
            <p className="text-bold success-tips">Now follow our official account, send this Tweet to get airdrop!</p>
            <p className="twitter-tips">Mises Official Twitter: @mises001</p>
            <div className="text-area">
              {/* <TextArea 
                value={getValue}
                autoSize={{ minRows: 0, maxRows: 4 }}
                style={{'--font-size':'14px',marginBottom:'10px'}}
                onChange={setValue}
                placeholder="Please enter your tweet here"
              /> */}
              <p className="font-14 tweet" dangerouslySetInnerHTML={{__html:unEditText}}></p>
            </div>
            <Button 
              className="btn" 
              fill='solid' 
              color='primary'
              loading={loading}
              onClick={getAirdrop}>
              <span>Follow & Send and get airdrop</span>
            </Button>
          </>}

          {status!=='success'&&status!==''&&<>
            {!['gotMIS','unGotMIS'].includes(status) ? <>
            <p className="fail-reason">Your account does not meet the requirements</p>
            <p className="fail-reason">
              Reason: {statusTxt()}
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
