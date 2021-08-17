/*
 * @Author: lmk
 * @Date: 2021-07-15 01:09:29
 * @LastEditTime: 2021-08-12 23:54:21
 * @LastEditors: lmk
 * @Description: 
 */

import React from 'react';
import link from '@/images/link.png'
import Image from '@/components/Image/index';
import './index.scss'
import { newTagPage } from '@/utils/postMessage';
/**
 * @description: userHeader and follow Btn
 * @param {*} theme
 * @return {*} element 
 */ 
const Link = ({theme="primary",item={}})=>{
  const bgClass = {
    primary:'m-bg-f8f8f8',
    white:"m-bg-fff"
  }[theme]
  const linkTo =e=>{
    e.stopPropagation();
    newTagPage(item.link)
  }
  return <div className={`m-flex m-row-between forwardBox ${bgClass}`} onClick={linkTo}>
  <div className="m-flex">
    <Image shape='square' size='sm' source={item.attachment_url}/>
    <div className="m-margin-left8">
      <span className="m-font12 title">{item.title}</span>
      <p className="timeAndType m-colors-999">{item.host}</p>
    </div>
  </div>
  <img src={link} className="iconStyle m-margin-right5" alt="link"></img>
</div>
}
export default Link