/*
 * @Author: lmk
 * @Date: 2021-07-14 21:52:16
 * @LastEditTime: 2021-07-16 13:51:39
 * @LastEditors: lmk
 * @Description: 
 */
import React from 'react';
import head from '@/images/head.png'
/**
 * @description: img
 * @param {*} source src for image
 * @param {*} size image layout
 * @param {*} shape image shape
 * @param {*} alt img type
 * @return {*} element
 */
const Image = ({source,size='lg',shape='circle',alt="avatar",onClick})=>{
  //shape:circle square 
  const imgSize = typeof size ==='string' ? {
    md:'60px',
    lg:'40px',
    sm:'28px',
    xs:'15px'
  }[size] : `${size}px`;
  return <img src={source || head} style={{height:imgSize,width:imgSize}} className={`border-${shape}`} alt={alt} onClick={onClick}/>
}
export default Image