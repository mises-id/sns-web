/*
 * @Author: lmk
 * @Date: 2021-12-02 14:02:45
 * @LastEditTime: 2022-01-04 14:48:34
 * @LastEditors: lmk
 * @Description:
 */
import "@/styles/common.scss";
import "./style.scss";
import React, { useEffect, useState } from "react";
import { Toast, Popup } from "zarm";
import { useTranslation } from "react-i18next";
import removeImage from "@/images/deleteImage.png";
import cameraIcon from "@/images/camera.png";
import "react-photo-view/dist/index.css";
import EditImage from "../EditImage";
import Image from "../Image";

const Upload = ({imageList, setImageList}) => {
  const [maxLength, setmaxLength] = useState(9);
  const [activityImage, setactivityImage] = useState("");
  const [activityIndex, setactivityIndex] = useState(null);
  const [visible, setvisible] = useState(false);
  const { t } = useTranslation();
  // get change file
  const inputChange = (e) => {
    if (maxLength === 0) {
      Toast.show(t("upLoadFileWarning"));
      return false;
    }
    const files = Array.from(e.target.files)
      .slice(0, maxLength)
      .map((val) => {
        return {
          url:window.URL.createObjectURL(val),
          file:val
        }
      });
    console.log(files);
    const maxLen = maxLength - files.length || 0;
    setmaxLength(maxLen);
    imageList = [...imageList, ...files];
    setImageList(imageList);
  };
  // remove image item
  const deleteImage = (index) => {
    console.log(index)
    imageList.splice(index,1)
    setImageList(imageList);
    const len = 9 - imageList.length
    setmaxLength(len);
  };
  // preview image list
  const editImage = (index) => {
    const image = imageList[index];
    setactivityImage(image.url);
    setactivityIndex(index);
    setvisible(true);
  };
  const send = (image,index) => {
    imageList[index] = image;
    setImageList(imageList);
    closePop()
  };
  const closePop = () => {
    setactivityImage("");
    setactivityIndex(null);
    setvisible(false);
  };
  useEffect(() => {
    // setImageList(imageList)
    const maxLen = 9 - imageList.length;
    // console.log(maxLen)
    setmaxLength(maxLen);
  }, [imageList]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={`m-grid grid-rows m-padding8`}>
      {/* upload image list */}
      {imageList.map((item, index) => (
        <div className={`upload-box-size m-position-relative`} key={index}>
          <img
            src={removeImage}
            alt=""
            className="remove-image"
            onClick={() => deleteImage(index)}
          />
          <img
            src={item.url}
            alt=""
            className={`border-radius5 img-object-fit`}
            onClick={() => editImage(index)}
          />
        </div>
      ))}
      {/* upload components */}
      {maxLength > 0 && (
        <div
          className={`m-position-relative border-radius5 upload-box upload-box-size`}
        >
          <input
            type="file"
            className="file"
            onChange={inputChange}
            multiple
            maxLength={maxLength}
            accept="image/png,image/jpg,image/jpeg"
          />
          <div className="camera-icon">
            <Image size={25} source={cameraIcon} shape="square" height="auto"></Image>
          </div>
        </div>
      )}
      {/* image editor components */}
      <Popup
        visible={visible}
        direction="bottom"
        animationType="slideDown"
        mask={false}
      >
        {activityImage && (
          <EditImage
            image={activityImage}
            index={activityIndex}
            closePop={closePop}
            send={send}
          ></EditImage>
        )}
      </Popup>
    </div>
  );
};
export default Upload;
