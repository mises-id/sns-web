/*
 * @Author: lmk
 * @Date: 2021-07-14 21:52:16
 * @LastEditTime: 2022-01-24 18:18:24
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
  source,
  size = "lg",
  shape = "circle",
  alt = "avatar",
  onClick,
  borderRadius = "1px",
  height,
}) => {
  const [status, setstatus] = useState('loading'); // loading success error
  const normal = alt === "avatar" ? head : image;
  const renderImageStatus = {
    loading:()=>{
      return <img
        src={normal}
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
    },
    success:()=>{
      if(!source){
        setstatus('error')
        return '';
      }
      return <img
        onError={error.bind(this)}
        src={source}
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
    },
    error:()=>{
      console.log('error image');
      return <img
        src={normal}
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
    }
  }
  //shape:circle square
  borderRadius = shape === "circle" ? "50%" : borderRadius;
  useEffect(() => {
    // setsrc(source || head);
    source&&setstatus('success')
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
  const error = (e) => {
    setstatus('error')
  };
  return renderImageStatus[status]();
};
export default Image;
