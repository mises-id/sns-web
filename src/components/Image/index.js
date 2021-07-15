import React from 'react';
import normal from '@/images/normal.png'
/**
 * @description: img
 * @param {*} source src for image
 * @param {*} size image layout
 * @param {*} shape image shape
 * @param {*} alt img type
 * @return {*} element
 */
const Image = ({source,size='lg',shape='circle',alt="avatar"})=>{
  //shape:circle square 
  const imgSize = typeof size ==='string' ? {
    md:'60px',
    lg:'40px',
    sm:'28px',
    xs:'15px'
  }[size] : `${size}px`;
  return <img src={source || normal} style={{height:imgSize,width:imgSize}} className={`border-${shape}`} alt={alt}/>
}
export default Image