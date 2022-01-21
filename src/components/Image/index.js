/*
 * @Author: lmk
 * @Date: 2021-07-14 21:52:16
 * @LastEditTime: 2022-01-21 21:46:34
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useState } from "react";
import head from "@/images/head.png";
import image from "@/images/image.png";
/**
 * @description: img
 * @param {*} source src for image
 * @param {*} size image layout
 * @param {*} shape image shape
 * @param {*} alt img type
 * @return {*} element
 */
const Image = ({
  source = head,
  size = "lg",
  shape = "circle",
  alt = "avatar",
  onClick,
  borderRadius = "1px",
  height,
}) => {
  //shape:circle square
  const normal = alt === "avatar" ? head : image;
  const [src, setsrc] = useState(normal);
  borderRadius = shape === "circle" ? "50%" : borderRadius;
  useEffect(() => {
    setsrc(source || head);
  }, [source]);
  const imgSize =
    typeof size === "string"
      ? {
          md: "60px",
          lg: "40px",
          sm: "28px",
          xs: "15px",
        }[size] || size
      : `${size}px`;
  const error = (e) => setsrc(normal);
  return (
    src && (
      <img
        onError={error.bind(this)}
        src={src}
        style={{
          height: height || imgSize,
          width: imgSize,
          objectFit: "cover",
          borderRadius,
        }}
        className={`border-${shape}`}
        alt={alt}
        onClick={onClick}
      />
    )
  );
};
export default Image;
