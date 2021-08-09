/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2021-08-08 00:16:26
 * @LastEditors: lmk
 * @Description: 
 */
import React from 'react';
import { Icon, NavBar } from 'zarm';

const Navbar = ({title})=>{
  const back = ()=>{
    window.history.back()
  }
  return <NavBar left={<Icon type="arrow-left" size="sm" onClick={back} />} title={title} />
}
export default Navbar