/*
 * @Author: lmk
 * @Date: 2021-07-10 16:12:04
 * @LastEditTime: 2021-08-30 21:59:34
 * @LastEditors: lmk
 * @Description: 
 */
import React, {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'zarm';
import send from '@/images/send.png'
import './index.scss'
import Image from '@/components/Image';
import { getUserSelfInfo, signin } from '@/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginForm, setUserAuth, setUserToken } from '@/actions/user';
import urlToJson from '@/utils';
const {Panel} = Tabs;
const Home = ({history,children=[]})=>{
  const {t} = useTranslation()
  const [tab] = useState([{ path: '/home/', text:t('follow') },{ path: '/home/discover', text:t('discover') },{ path: '/home/me', text:t('me') }])
  const [value, setvalue] = useState(0)
  const dispatch = useDispatch()
  const setTabActive = ()=>{
    const {pathname} = window.location;
    //get hostname to set tabIndex
    const path = pathname==='/home/'?'/home' :pathname;
    switch (path) {
      case '/home':
        setvalue(0)
      break;
      case '/home/discover':
        setvalue(1)
      break;
      default:
        setvalue(2)
      break;
    }
    const {mises_id,nonce,sig} = urlToJson();
    if(mises_id&&nonce&&sig){
      const auth = `mises_id=${mises_id}&nonce=${nonce}&sig=${sig}`;
      dispatch(setUserAuth(auth))
    }
  }
  const user = useSelector(state => state.user) || {}
  const {auth,token} = user
  useEffect(()=>{
    if(auth&&!token){
      signin({
        "provider": "mises",
        "user_authz": {auth}
      }).then(data=>{
        data.token&&dispatch(setUserToken(data.token))
      })
      // settab(t=>{
      //   t[2].path = '/home/me'
      //   return t;
      // })
      return false;
    }
    // if(!token){
    //   settab(t=>{
    //     t[2].path = '/home/createMisesId'
    //     return t;
    //   })
    // }
    if(token){
      getUserSelfInfo().then(res=>{
        dispatch(setLoginForm(res))
      })
    }
  },[auth,token])// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    document.body.style.overflow = 'hidden'
    setTabActive(); 
    history.listen(location => {
      setTabActive();
    })
    return ()=>{
      document.body.style.overflow = 'auto';
    }
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  //change current and change route
  const getChange = val=>{
    setvalue(val)
    const path = tab[val];
    history.push(path.path)
  }
  const createPosts = ()=>{
    history.push({pathname:'/createPosts'})
  }
  //show current path route page
  const showChild = path=>children.find(val=>val.key===path) || <div></div>
  return <div>
    <Tabs value={value} onChange={getChange} lineWidth={10} swipeable={false}>
      {tab.map((val,index)=>(<Panel key={val.path} title={<span className={value===index?'active':'unactive'}>{val.text}</span>}>
      {showChild(val.path)}
      </Panel>))}
    </Tabs>
    {token&&<div className="m-position-fixed createPosts">
      <Image size={75} alt="posts" onClick={createPosts} source={send} shape="square"></Image>
    </div>}
  </div>
}
export default Home