/*
 * @Author: lmk
 * @Date: 2021-07-15 12:58:47
 * @LastEditTime: 2021-07-15 14:21:38
 * @LastEditors: lmk
 * @Description: cell Component
 */
import React from 'react';
import Image from '../Image';
import arrow from '@/images/arrow.png'
import './index.scss'
/**
 * @description: cell params introduce
 * @param {*} icon show iconImage
 * @param {*} label show cell txt
 * @param {*} iconSize iconSize
 * @param {*} rightChild right element
 * @param {*} className custom className
 * @param {*} showIcon isshow icon
 * @param {*} showLine isshow bottomLine
 * @return {*} cellelement
 */
const Cell = ({icon,label,onPress,iconSize,showArrow=true,rightChild,className="",showIcon=true,showLine=true})=>{
  return <div className={`m-flex m-row-between m-padding-tb20 ${className} ${showLine ? 'm-line-bottom' : ''}`} onClick={onPress}>
  <div className="m-flex">
    {showIcon&&<Image size={iconSize} source={icon} shape="square"></Image>}
    <span className={`m-colors-333 m-font16 ${showIcon ? 'm-margin-left15' : ''}`}>{label}</span>
  </div>
  <div className="m-flex">
    {rightChild&&<div className={`${showArrow ? 'm-margin-right15' : ''}`}>{rightChild}</div>}
    {showArrow&&<img src={arrow} alt="" className="arrow"/>}
  </div>
</div>
}
export default Cell