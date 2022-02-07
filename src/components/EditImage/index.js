/*
 * @Author: lmk
 * @Date: 2021-12-02 17:31:09
 * @LastEditTime: 2022-02-07 16:16:48
 * @LastEditors: lmk
 * @Description:
 */
import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import jieping from "@/images/tailor.png";
import wenben from "@/images/text.png";
import rotate from "@/images/rotate.png";
import txtActive from "@/images/text_select.png";
import NavbarRightButton from "@/components/NavbarRightButton";
import removeImage from "@/images/deleteImage.png";
import "./styles.scss";
import Konva from "konva";
import { useTranslation } from "react-i18next";
const EditImage = ({ image, index, closePop, send }) => {
  const [editImage, seteditImage] = useState(image); // edit photo data
  const [cropper, setcropper] = useState(null); //cropper data
  const [cropperFlag, setCropperFlag] = useState(false); //show cropper flag
  const [textFlag, setTextFlag] = useState(false); // show textarea flag
  const [isEdit, setisEdit] = useState(false); // is set edit
  const { t } = useTranslation(); // i18n hooks
  const [activeColorIndex, setactiveColorIndex] = useState(0); // current activeColor
  const [activeBg, setactiveBg] = useState(false); //show txt background
  const [stage, setstage] = useState(null); // stage container
  const [layer, setlayer] = useState(null); // layer container
  const textarea = useRef(null); // textarea ref
  const [cropperImage, setcropperImage] = useState(null);
  // const [isPointerdown, setisPointerdown] = useState(false);
  const [textShowPosition, settextShowPosition] = useState({
    width: 0,
    x: 0,
    height: 0,
  });
  const colorList = [
    "#f1f1f1",
    "#2b2b2b",
    "#e5635d",
    "#f1c555",
    "#6cbf6f",
    "#63adf8",
    "#6669ed",
  ];
  const [textareaStyle, settextareaStyle] = useState({});
  useEffect(() => {
    setBgTxtColor(activeBg, activeColorIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBg, activeColorIndex]);

  useEffect(() => {
    if (editImage) {
      //set stage container
      const imageObj = new Image();
      imageObj.onload = function () {
        drawImage(this);
      };
      imageObj.src = editImage;
    }
    if (!editImage && stage) {
      stage.destory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editImage]);
  /* 
    draw image;
    1.get image aspect ratio
    2.Set the width of the picture
  */
  const drawImage = (imageObj) => {
    const stage = new Konva.Stage({
      container: "#image-container",
      width: window.innerWidth,
      height: window.innerHeight - 44 - 73,
      draggable:true
    });
    const layer = new Konva.Layer();
    const img = addImage(imageObj); // return image content
    layer.add(img);
    stage.add(layer);
    stage.setHeight(img.attrs.height)
    setstage(stage);
    setlayer(layer);
  };
  // return image content
  const addImage = (imageObj) => {
    const imageAspectRatio = imageObj.height / imageObj.width;
    const imageWidth = window.innerWidth;
    const imageHeight = imageWidth * imageAspectRatio;
    const y = 0;
    const x = 0;
    const img = new Konva.Image({
      image: imageObj,
      x,
      y,
      width: imageWidth,
      height: imageHeight,
    });
    settextShowPosition({
      width: imageWidth,
      height: imageHeight,
      x,
      y
    });
    return img;
  };
  // let pointers = [], // 触摸点数组
  //   point1 = { x: 0, y: 0 }, // 第一个点坐标
  //   point2 = { x: 0, y: 0 }, // 第二个点坐标
  //   diff = { x: 0, y: 0 }, // 相对于上一次pointermove移动差值
  //   lastPointermove = { x: 0, y: 0 }, // 用于计算diff
  //   lastPoint1 = { x: 0, y: 0 }, // 上一次第一个触摸点坐标
  //   lastPoint2 = { x: 0, y: 0 }, // 上一次第二个触摸点坐标
  //   lastCenter; // 上一次中心点坐标
  // let x, // x轴偏移量
  //   y, // y轴偏移量
  //   scale = 1, // 缩放比例
  //   maxScale = 2, // 最大缩放
  //   minScale = 0.5; //最小缩放
  // const handlePointers = (e, type) => {
  //   const findPointerIndex = pointers.findIndex(
  //     (val) => val.pointerId === e.pointerId
  //   );
  //   if (findPointerIndex > -1) {
  //     if (type === "update") {
  //       pointers[findPointerIndex] = e.evt;
  //     }
  //     if (type === "delete") {
  //       pointers.splice(findPointerIndex, 1);
  //     }
  //   }
  // };
  // const getDistance = (a, b) => {
  //   const x = a.x - b.x;
  //   const y = a.y - b.y;
  //   return Math.hypot(x, y); // Math.sqrt(x * x + y * y);
  // };
  // /**
  //  * 获取中点坐标
  //  * @param {object} a 第一个点坐标
  //  * @param {object} b 第二个点坐标
  //  * @returns
  //  */
  // const getCenter = (a, b) => {
  //   const x = (a.x + b.x) / 2;
  //   const y = (a.y + b.y) / 2;
  //   return { x: x, y: y };
  // };
  // // listenstage
  // const listenStage = (stage) => {
  //   x = stage.x();
  //   y = stage.y();
  //   stage.on("pointerdown", (e) => {
  //     pointers.push(e.evt);
  //     point1 = { x: pointers[0].clientX, y: pointers[0].clientY };
  //     if (pointers.length === 1) {
  //       // 单点触碰 记录触碰开始
  //       setisPointerdown(true);
  //       const stageId = document.getElementById("image-container");
  //       stageId.setPointerCapture(e.evt.pointerId);
  //       lastPointermove = { x: pointers[0].clientX, y: pointers[0].clientY };
  //     } else if (pointers.length === 2) {
  //       point2 = { x: pointers[1].clientX, y: pointers[1].clientY };
  //       lastPoint2 = { x: pointers[1].clientX, y: pointers[1].clientY };
  //       lastCenter = getCenter(point1, point2);
  //     }
  //     lastPoint1 = { x: pointers[0].clientX, y: pointers[0].clientY };
  //   });
  //   stage.on("pointermove", (e) => {
  //     if (isPointerdown) {
  //       handlePointers(e, "update");
  //       const current1 = { x: pointers[0].clientX, y: pointers[0].clientY };
  //       if (pointers.length === 1) {
  //         // 单指拖动查看图片
  //         diff.x = current1.x - lastPointermove.x;
  //         diff.y = current1.y - lastPointermove.y;
  //         lastPointermove = { x: current1.x, y: current1.y };
  //         x += diff.x;
  //         y += diff.y;
  //         // stage.scale({ x: scale, y: scale });
  //       }
  //       if (pointers.length === 2) {
  //         const current2 = { x: pointers[1].clientX, y: pointers[1].clientY };
  //         // 计算相对于上一次移动距离比例 ratio > 1放大，ratio < 1缩小
  //         let ratio =
  //           getDistance(current1, current2) /
  //           getDistance(lastPoint1, lastPoint2);
  //         // 缩放比例
  //         const _scale = scale * ratio;
  //         if (_scale > maxScale) {
  //           scale = maxScale;
  //           ratio = maxScale / scale;
  //         } else if (_scale < minScale) {
  //           scale = minScale;
  //           ratio = minScale / scale;
  //         } else {
  //           scale = _scale;
  //         }
  //         // 计算当前双指中心点坐标
  //         const center = getCenter(current1, current2);
  //         // 计算图片中心偏移量，默认transform-origin: 50% 50%
  //         // 如果transform-origin: 30% 40%，那origin.x = (ratio - 1) * result.width * 0.3
  //         // origin.y = (ratio - 1) * result.height * 0.4
  //         // 如果通过修改宽高或使用transform缩放，但将transform-origin设置为左上角时。
  //         // 可以不用计算origin，因为(ratio - 1) * result.width * 0 = 0
  //         const origin = {
  //           x: (ratio - 1) * textShowPosition.width * 0.5,
  //           y: (ratio - 1) * textShowPosition.height * 0.5,
  //         };
  //         // 计算偏移量，认真思考一下为什么要这样计算(带入特定的值计算一下)
  //         x -=
  //           (ratio - 1) * (center.x - x) - origin.x - (center.x - lastCenter.x);
  //         y -=
  //           (ratio - 1) * (center.y - y) - origin.y - (center.y - lastCenter.y);
  //         stage.scale({ x: scale, y: scale });
  //         stage.position({ x, y });
  //         // image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
  //         lastCenter = { x: center.x, y: center.y };
  //         lastPoint1 = { x: current1.x, y: current1.y };
  //         lastPoint2 = { x: current2.x, y: current2.y };
  //       }
  //     }
  //     e.evt.preventDefault();
  //   });
  //   stage.on("pointerup", (e) => {
  //     if (isPointerdown) {
  //       handlePointers(e, "delete");
  //       if (pointers.length === 0) {
  //         setisPointerdown(false);
  //       } else if (pointers.length === 1) {
  //         point1 = { x: pointers[0].clientX, y: pointers[0].clientY };
  //         lastPointermove = { x: pointers[0].clientX, y: pointers[0].clientY };
  //       }
  //     }
  //   });
  //   stage.on("pointercancel", (e) => {
  //     if (isPointerdown) {
  //       setisPointerdown(false);
  //       pointers = [];
  //     }
  //   });
  //   let scaleBy = 1.01;
  //   stage.on("wheel", (e) => {
  //     // stop default scrolling
  //     e.evt.preventDefault();

  //     const oldScale = stage.scaleX(); // 获取到上次缩放比例
  //     const pointer = stage.getPointerPosition(); // 获取中心点缩放位置
  //     //中心点坐标减去盒子顶点坐标除以缩放比例等于
  //     const mousePointTo = {
  //       x: (pointer.x - stage.x()) / oldScale,
  //       y: (pointer.y - stage.y()) / oldScale,
  //     };

  //     // how to scale? Zoom in? Or zoom out? 判断是放大还是缩小 小于0就是放大否则就是缩小
  //     let direction = e.evt.deltaY > 0 ? 1 : -1;

  //     // when we zoom on trackpad, e.evt.ctrlKey is true
  //     // in that case lets revert direction 所以这里要判断为真才是放大
  //     if (e.evt.ctrlKey) {
  //       direction = -direction;
  //     }
  //     //如果是放大则用上次缩放比乘以scaleBy否则除以
  //     const _scale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  //     let newScale = _scale;
  //     if (_scale > maxScale) {
  //       newScale = maxScale;
  //     } else if (_scale < minScale) {
  //       newScale = minScale;
  //     } else {
  //       newScale = _scale;
  //     }
  //     // 缩放比例
  //     stage.scale({ x: newScale, y: newScale });

  //     const newPos = {
  //       x: pointer.x - mousePointTo.x * newScale,
  //       y: pointer.y - mousePointTo.y * newScale,
  //     };
  //     stage.position(newPos);
  //   });
  // };
  // remove
  const closeCropper = () => {
    setCropperFlag(false);
    setisEdit(false);
  };
  const dataURLtoFile = (dataurl, fileName)=>{
    let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const theBlob =  new Blob([u8arr], { type: mime });
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return {
      file:theBlob,
      url: window.URL.createObjectURL(theBlob)
    };
  }
  // save edits
  const saveEdit = () => {
    const image = dataURLtoFile(returnEditImage(),`image${index}.png`);
    send(image, index);
    console.log(image);
  };

  const rotateImage = () => {
    cropper.rotate(90);
  };
  const cropperSave = () => {
    const option = {
      fillColor: "#fff",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    };
    cropper.getCroppedCanvas(option).toBlob((blob) => {
      const image = window.URL.createObjectURL(blob);
      seteditImage(image);
      closeCropper();
    });
  };
  const setActiveBackground = () => {
    setactiveBg(!activeBg);
  };
  const setBgTxtColor = (bgFlag, index) => {
    const color = colorList[index];
    const style = {
      color: bgFlag ? (color === "#f1f1f1" ? "#000000" : "white") : color,
      backgroundColor: bgFlag ? color : "transparent",
    };
    settextareaStyle(style);
    return style;
  };
  //reset
  const closeTxt = () => {
    setactiveBg(false);
    setactiveColorIndex(0);
    setTextFlag(false);
    setactivityTextObj(null);
  };
  const drawGroup = (x, y) => {
    return new Konva.Group({
      x,
      y,
      draggable: true,
    });
  };
  const drawText = (txt, style) => {
    return new Konva.Text({
      text: txt,
      fontSize: 30,
      wrap: "char",
      padding: 10,
      width: textShowPosition.width - 20,
      fill: style.color,
    });
  };
  const drawRect = (text, style) => {
    const rectObj = {
      width: text.textWidth + 20,
      height: text.height(),
      fill: style.backgroundColor,
      cornerRadius: 10,
    };
    if (style.backgroundColor === "transparent") {
      rectObj.strokeWidth = 1;
      rectObj.stroke = "#BBBBBB";
    }
    return rectObj;
  };
  const drawRemoveImage = (text) => {
    return new Promise((resolve) => {
      const imageObj = new Image();
      imageObj.onload = function () {
        const removeImage = new Konva.Image({
          image: this,
          x: text.textWidth + 8,
          y: -8,
          width: 20,
          height: 20,
        });
        resolve(removeImage);
      };
      imageObj.src = removeImage;
    });
  };
  // create click to group
  const listenGroupClick = (group, rectObj) => {
    group.on("tap", (e) => {
      const target = layer.getIntersection(stage.getPointerPosition());
      if (target) {
        if (target.className === "Image") {
          // remove this
          target.parent.destroy();
        }
        if (target.className === "Text") {
          // edit text
          setactivityTextObj(target); // set edit flag
          const attrs = target.attrs;
          setTextFlag(true); // show text modal
          textarea.current.innerHTML = attrs.text; // set input value
          const color =
            rectObj.fill !== "transparent" ? rectObj.fill : attrs.fill;
          const colorIndex =
            attrs.fill === "#000000"
              ? 0
              : colorList.findIndex((val) => val === color);
          if (colorIndex > -1) {
            const isBg = rectObj.fill !== "transparent";
            setactiveColorIndex(colorIndex);
            setactiveBg(isBg);
            setBgTxtColor(isBg, colorIndex);
          }
        }
      }
    });
  };
  const [activityTextObj, setactivityTextObj] = useState(null);
  const TxtSave = async () => {
    const txt = textarea.current.innerText;
    if (!txt) {
      return false;
    }
    const style = setBgTxtColor(activeBg, activeColorIndex);
    const text = drawText(txt, style); // create text
    let xy = {
      x: stage.width() / 2 - (text.textWidth + 20) / 2,
      y: stage.height() / 2 - text.height() / 2,
    };
    if (activityTextObj) {
      //edit
      const attrs = activityTextObj.parent.attrs;
      xy.y = attrs.y;
      activityTextObj.parent.destroy();
      setactivityTextObj(null);
    }
    const group = drawGroup(xy.x, xy.y);
    const rectObj = drawRect(text, style); //create  rect config
    const rect = new Konva.Rect(rectObj); //create rect
    const drawRemoveImageObj = await drawRemoveImage(text);
    listenGroupClick(group, rectObj);
    group.add(rect);
    group.add(text);
    group.add(drawRemoveImageObj); // create remove image
    layer.add(group);
    closeTxt();
  };
  const getInput = (e) => {
    let txt = textarea.current.innerText;
    const max = 50;
    const deleteCode = 8;
    if (txt.length >= max && e.keyCode !== deleteCode) {
      txt.substring(0, max);
      // e.preventDefault();
      return false;
    } else {
      return true;
    }
  };
  const showEditModel = () => {
    // resetImagePositon()
    setTextFlag(true);
    focus()
  };

  const focus = ()=>{
    textarea.current && textarea.current.focus();
  }
  const showCropper = () => {
    // resetImagePositon()
    setCropperFlag(true);
    setisEdit(true);
    const dataURL = returnEditImage();
    setcropperImage(dataURL);
    // after get dataURL show element
    stage.find("Image").forEach((element) => {
      if (element.parent.nodeType === "Group") {
        element.show();
      }
    });
  };
  const returnEditImage = () => {
    //before open set hide element
    // let imageWidth, imageHeight;
    stage.find("Image").forEach((element) => {
      if (element.parent.nodeType === "Group") {
        element.hide();
      }
    });
    const dataURL = stage.toDataURL({ pixelRatio: 2,quality:1});
    return dataURL;
  };
  return (
    <div style={{'--window-height':`${window.innerHeight}px`}}>
      {/* Show edit photo */}
      <div className={`m-flex m-flex-col edit-image-box`}>
        {!textFlag && (
          <NavbarRightButton
            rightTxt={t("done")}
            leftTxt={t("cancel")}
            leftBtnClick={closePop}
            title={t("editPhoto")}
            rightBtnClick={saveEdit}
          />
        )}
        <div
          className={`m-flex-1 m-flex image-container`}
          id="image-container"
          style={{ height: "0" }}
        ></div>
        {/* show Edit button icon*/}
        <div className="icon-box-edit">
          <img src={jieping} alt="" className="icon" onClick={showCropper} />
          <img src={wenben} alt="" className="icon" onClick={showEditModel} />
        </div>
      </div>
      {/* cropped */}
      {isEdit && cropperFlag && (
        <div className={`m-flex m-flex-col edit-cropper-box`}>
          <NavbarRightButton
            rightTxt={t("Done")}
            leftTxt={t("cancel")}
            leftBtnClick={closeCropper}
            rightBtnClick={cropperSave}
          />
          <div className="m-flex-1" style={{ height: "0" }}>
            <Cropper
              src={cropperImage}
              background={false}
              center={false}
              style={{ height: "100%", width: "100%",backgroundColor:'#000000'}}
              onInitialized={setcropper}
              viewMode={2}
              dragMode="move"
            />
          </div>
          <div className="rotate">
            <img src={rotate} alt="" className="icon" onClick={rotateImage} />
          </div>
        </div>
      )}
      {/* add Text */}
      {textFlag && (
        <div className={`m-flex m-flex-col edit-text-container`}>
          <NavbarRightButton
            rightTxt={t("send")}
            leftTxt={<span className="m-colors-fff">{t("cancel")}</span>}
            leftBtnClick={closeTxt}
            rightBtnClick={TxtSave}
          />
          <div className={`m-flex-1 m-flex content-editable`} onClick={focus}>
            <div
              contentEditable
              className={`content-textarea`}
              style={textareaStyle}
              ref={textarea}
              onKeyDown={getInput}
            ></div>
          </div>
          <div className={`m-flex color-list-container`}>
            <div
              className={`color-list-box m-flex m-row-center`}
              onClick={setActiveBackground}
            >
              <img src={!activeBg ? wenben : txtActive} alt="" className="icon" />
            </div>
            {colorList.map((val, index) => (
              <div
                key={index}
                className={`color-list-box m-flex m-row-center`}
                onClick={() => {
                  setactiveColorIndex(index);
                }}
              >
                <div
                  style={{
                    backgroundColor: val,
                    borderWidth: activeColorIndex === index ? "3px" : "2px",
                  }}
                  className="color-list-item"
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default EditImage;
