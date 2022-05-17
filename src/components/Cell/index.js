/*
 * @Author: lmk
 * @Date: 2021-07-15 12:58:47
 * @LastEditTime: 2022-05-17 15:15:16
 * @LastEditors: lmk
 * @Description: cell Component
 */
import React from "react";
import Image from "../Image";
import arrow from "@/images/arrow.png";
import "./index.scss";
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
const Cell = ({
  icon,
  label,
  onPress,
  iconSize,
  showArrow = true,
  rightChild,
  className = "m-padding-tb20",
  showIcon = true,
  showLine = true,
  labelStyle = {},
  shape = "circle",
  subTitle
}) => {
  return (
    <div
      className={`m-flex m-row-between  ${className} ${
        showLine ? "m-line-bottom" : ""
      }`}
      onClick={onPress}
    >
      <div className="m-flex">
        {showIcon && (
          <>
            {typeof icon === 'string'&&<Image size={iconSize} shape={shape} source={icon} />}
            {typeof icon !== 'string'&&icon}
          </>
        )}
        <div className={`${showIcon ? "m-margin-left13" : ""}`}>
          <span className={`m-colors-333 m-font16`} style={labelStyle}>
            {label}
          </span>
          <div className="m-margin-top5">{subTitle}</div>
        </div>
      </div>
      <div className="m-flex right-content">
        {rightChild && (
          <div className={`${showArrow ? "m-margin-right15" : ""}`}>
            {rightChild}
          </div>
        )}
        {showArrow && <img src={arrow} alt="" className="arrow" />}
      </div>
    </div>
  );
};
export default Cell;
