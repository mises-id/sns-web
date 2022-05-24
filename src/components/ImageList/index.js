/*
 * @Author: lmk
 * @Date: 2021-07-14 21:52:16
 * @LastEditTime: 2022-05-18 16:24:00
 * @LastEditors: lmk
 * @Description:
 */
import React, { useState } from "react";
import "@/styles/common.scss";
import "./style.scss";
import { ImageViewer,Image } from 'antd-mobile'

const ImageList = ({ thumbImages=[], list = [], boxWidth = window.innerWidth }) => {
  let [style, setstyle] = useState({
    width: "200px",
    height: "200px",
  });
  // get image width and height
  const imageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    //set once image width
    const radio = naturalWidth / naturalHeight;
    if (naturalWidth > naturalHeight) {
      style = {
        width: "200px",
        height: "auto",
      };
    }
    if (naturalWidth < naturalHeight) {
      style = {
        height: "200px",
        width: radio * 200 + "px",
      };
    }
    setstyle(style);
  };
  // only one
  const firstImage = () => {
    return (
      <Image
        src={thumbImages[0]}
        alt=""
        onLoad={imageLoad}
        className="imgListOnce"
        {...style}
        onClick={e=>{
          e.stopPropagation()
          ImageViewer.show({ image: list[0]})
        }}
      />
    );
  };
  const drawImageList = (size) => {
    const width = (boxWidth - 30) / size;
    return (
      <div className={`m-flex m-flex-warp`}>
        {thumbImages.map((val, index) => (
          <div
            style={{ width: `${width}px`, height: `${width}px` }}
            key={index}
            className="img-box"
            onClick={e=>{
              e.stopPropagation()
              ImageViewer.Multi.show({ images: list,defaultIndex:index })
            }}
          >
            <Image src={val} fit="cover" lazy style={{ borderRadius: 4 }}  size="100%" width={width - 10} height={width - 10} />
          </div>
        ))}
      </div>
    );
  };
  // second mode 2*2 layout
  const secondImageMode = () => drawImageList(2);
  // third mode 3*3 layout
  const thirdImageMode = () => drawImageList(3);
  return (
    <div className="imageList">
      {list.length === 1 && firstImage()}
      {list.length > 1 && list.length !==3 && list.length < 5 && secondImageMode()}
      {(list.length > 4 || list.length ===3) && thirdImageMode()}
    </div>
  );
};
export default ImageList;
