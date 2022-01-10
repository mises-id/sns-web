/*
 * @Author: lmk
 * @Date: 2021-08-28 22:50:59
 * @LastEditTime: 2022-01-05 11:17:04
 * @LastEditors: lmk
 * @Description:
 */
import React from "react";
import "./index.scss";
const MButton = ({
  borderColor = "#5D61FF",
  txtColor = "#5D61FF",
  txtSize = 12,
  txt = "",
  imgIcon = "",
  width = 70,
  height = 25,
  onPress,
  iconSize = 8,
  backgroundColor="transparent",
}) => {
  const click = (e) => {
    e.stopPropagation();
    onPress(e);
  };
  return (
    <div
      className="btn-box"
      onClick={click}
      style={{
        "--borderColor": borderColor,
        width: width + "px",
        height: height + "px",
        lineHeight: height + "px",
        backgroundColor,
        borderRadius:"30px"
      }}
    >
      {imgIcon && (
        <img
          src={imgIcon}
          alt=""
          style={{ width: iconSize + "px", marginRight: txt ? "5px" : "" }}
        />
      )}
      <span style={{ color: txtColor, fontSize: txtSize + "px" }}>{txt}</span>
    </div>
  );
};
export default MButton;
