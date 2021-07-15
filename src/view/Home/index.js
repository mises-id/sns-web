/*
 * @Author: lmk
 * @Date: 2021-07-10 16:12:04
 * @LastEditTime: 2021-07-15 14:54:15
 * @LastEditors: lmk
 * @Description: 
 */
import React, {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'zarm';
import './index.scss'
const {Panel} = Tabs;
const {pathname} = window.location;
//get hostname to set tabIndex
let tabIndex = 0;
console.log(pathname)
switch (pathname) {
  case '/home':
    tabIndex = 0
    break;
    case '/home/discover':
      tabIndex = 1
      break;
  default:
    tabIndex = 2
    break;
}
const Home = (props)=>{
  useEffect(()=>{
    document.body.style.overflow = 'hidden'
    return ()=>{
      document.body.style.overflow = 'auto'
    }
  },[])
  const {t} = useTranslation()
  const tab = [{ path: '/home', text:t('follow') },{ path: '/home/discover', text:t('discover') },{ path: '/home/me', text:t('me') }];
  const [value, setvalue] = useState(tabIndex)
  //change current and change route
  const getChange = val=>{
    setvalue(val)
    const path = tab[val];
    props.history.push(path.path)
  }
  return <Tabs value={value} onChange={getChange} lineWidth={10} swipeable={true}>
    {tab.map((val,index)=><Panel key={val.path} title={<span className={value===index?'active':'unactive'}>{val.text}</span>}>{props.children}</Panel>)}
  </Tabs>
}
export default Home