/*
 * @Author: lmk
 * @Date: 2021-07-15 01:09:29
 * @LastEditTime: 2022-02-14 10:20:29
 * @LastEditors: lmk
 * @Description:
 */

import React from "react";
import link from "@/images/link.png";
import Image from "@/components/Image/index";
import "./index.scss";
// import { sdkLocationHref } from '@/utils/postMessage';
/**
 * @description: userHeader and follow Btn
 * @param {*} theme
 * @return {*} element
 */
const Link = ({ theme = "primary", item = {}, type }) => {
  const bgClass = {
    primary: "m-bg-f8f8f8",
    white: "m-bg-fff",
  }[theme];
  const linkTo = (e) => {
    e.stopPropagation();
    window.open(item.link);
  };
  return (
    item && (
      <div
        className={`m-flex m-row-between forwardBox ${bgClass}`}
        onClick={linkTo}
      >
        <div className="m-flex">
          <Image
            shape="square"
            size={!type ? "sm" : 35}
            alt="image"
            source={item.attachment_url}
          />
          <div className="m-margin-left7">
            <span className={`title ${!type ? "m-font12" : "m-font15"}`}>
              {item.title}
            </span>
            <p
              className={`m-colors-999 timeAndType ${
                !type ? "m-font10" : "m-font13"
              }`}
            >
              {item.host}
            </p>
          </div>
        </div>
        <img src={link} className="iconStyle m-margin-right5" alt="link"></img>
      </div>
    )
  );
};
export default Link;
