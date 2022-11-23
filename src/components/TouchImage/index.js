/*
 * @Author: lmk
 * @Date: 2021-12-06 09:34:18
 * @LastEditTime: 2021-12-06 13:36:12
 * @LastEditors: lmk
 * @Description: 
 */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef } from "react";
import PinchZoom from 'pinch-zoom-js'
import "./style.scss";
const TouchImage = (props) => {
  const ref = useRef(null)
  useEffect(() => {
    let el = document.querySelector('#img');
    new PinchZoom(el, {});
  }, [ref])
  return (
    <div className="img-box" >
      <img src={props.src} className="img" id="img"/>
    </div>
  );
};

export default TouchImage;
