/*
 * @Author: lmk
 * @Date: 2021-07-15 01:09:29
 * @LastEditTime: 2021-07-16 13:45:02
 * @LastEditors: lmk
 * @Description: 
 */

import React from 'react';
import link from '@/images/link.png'
import Image from '@/components/Image/index';
import './index.scss'
/**
 * @description: userHeader and follow Btn
 * @param {*} theme
 * @return {*} element 
 */ 
const Link = ({theme="primary"})=>{
  const bgClass = {
    primary:'m-bg-f8f8f8',
    white:"m-bg-fff"
  }[theme]
  return <div className={`m-flex m-row-between forwardBox ${bgClass}`}>
  <div className="m-flex">
    <Image shape='square' size='sm'/>
    <div className="m-margin-left8">
      <span className="m-font12">Alice</span>
      <p className="timeAndType m-colors-999">05.25<span className="m-margin-left5">post</span></p>
    </div>
  </div>
  <img src={link} className="iconStyle m-margin-right5" alt="link"></img>
</div>
}
export default Link