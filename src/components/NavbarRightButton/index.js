/*
 * @Author: lmk
 * @Date: 2021-08-07 22:30:53
 * @LastEditTime: 2021-12-31 17:02:44
 * @LastEditors: lmk
 * @Description:
 */
import React from "react";
import {  NavBar } from "zarm";

const Navbar = ({
  leftTxt,
  leftBtnClick = window.history.back,
  rightTxt,
  rightBtnClick,
  title=""
}) => {
  return (
    <NavBar
      left={
        <span onClick={leftBtnClick} className="m-font16">
          {leftTxt}
        </span>
      }
      title={title}
      right={<span className="m-colors-5c65f6 m-font16" onClick={rightBtnClick}>{rightTxt}</span>}
    />
  );
};
export default Navbar;
