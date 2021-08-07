/*
 * @Author: lmk
 * @Date: 2021-07-14 21:52:16
 * @LastEditTime: 2021-08-07 14:13:39
 * @LastEditors: lmk
 * @Description: 
 */
import React, { useEffect, useState } from 'react';
import head from '@/images/head.png'
/**
 * @description: img
 * @param {*} source src for image
 * @param {*} size image layout
 * @param {*} shape image shape
 * @param {*} alt img type
 * @return {*} element
 */
const Image = ({source=head,size='lg',shape='circle',alt="avatar",onClick})=>{
  //shape:circle square 
  const normal = alt==="avatar" ? head : '';
  const [src, setsrc] = useState(normal)
  useEffect(() => {
    source&&setsrc(source)
  }, [source])
  const imgSize = typeof size ==='string' ? {
    md:'60px',
    lg:'40px',
    sm:'28px',
    xs:'15px'
  }[size] : `${size}px`;
  const error = e=> setsrc(normal)
  return (src&&<img onError={error.bind(this)} src={src} style={{height:imgSize,width:imgSize}} className={`border-${shape}`} alt={alt} onClick={onClick}/>)
}
export default Image