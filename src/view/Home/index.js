/*
 * @Author: lmk
 * @Date: 2021-07-10 16:12:04
 * @LastEditTime: 2021-07-16 14:17:01
 * @LastEditors: lmk
 * @Description: 
 */
import React, {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'zarm';
import send from '@/images/send.png'
import './index.scss'
import Image from '@/components/Image';
const {Panel} = Tabs;
const Home = ({history,children})=>{
  const {t} = useTranslation()
  const tab = [{ path: '/home', text:t('follow') },{ path: '/home/discover', text:t('discover') },{ path: '/home/me', text:t('me') }];
  const [value, setvalue] = useState(0)
  const [swipeable, setswipeable] = useState(false)
  useEffect(()=>{
    document.body.style.overflow = 'hidden'
    const {pathname} = window.location;
    //get hostname to set tabIndex
    switch (pathname) {
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
    //setswipeable(true)
    return ()=>{
      document.body.style.overflow = 'auto';
      setswipeable(false)
    }
  },[])
  //change current and change route
  const getChange = val=>{
    setvalue(val)
    const path = tab[val];
    history.push(path.path)
  }
  const createPosts = ()=>{
    history.push({pathname:'/createPosts'})
  }
  return <div>
    <Tabs value={value} onChange={getChange} lineWidth={10} swipeable={swipeable}>
      {tab.map((val,index)=><Panel key={val.path} title={<span className={value===index?'active':'unactive'}>{val.text}</span>}>{children}</Panel>)}
    </Tabs>
    <div className="m-position-fixed createPosts">
      <Image size={75} onClick={createPosts} source={send}></Image>
    </div>
  </div>
}
export default Home