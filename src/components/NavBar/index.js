/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2021-08-30 23:12:59
 * @LastEditors: lmk
 * @Description: 
 */
import React from 'react';
import {  NavBar } from 'zarm';
import backIcon from '@/images/back.png'

const Navbar = ({title})=>{
  const back = ()=>{
    window.history.back()
  }
  return <NavBar left={<img src={backIcon} alt="back" onClick={back} style={{width:'22px' ,height:'22px'}}/>} title={title} />
}
export default Navbar