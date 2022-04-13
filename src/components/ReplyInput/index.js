/*
 * @Author: lmk
 * @Date: 2021-12-06 09:34:18
 * @LastEditTime: 2022-04-12 09:42:28
 * @LastEditors: lmk
 * @Description: 
 */
import React, { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "zarm";
import "./style.scss";
const ReplyInput = ({submit,content,placeholder,setselectItem,defaultItem},ref) => {
  const {t} = useTranslation();
  const [isFocus, setisFocus] = useState(false);
  return (
    <>
      <div className={`reply-input-box  ${isFocus ? 'focus-box' : ''}`}>
        <div className="m-line-top reply-input">
          <form onSubmit={submit} className="m-flex-1 m-flex ">
            <Input placeholder={placeholder||t('commentPlaceholder')} ref={ref} className="input" clearable={false} {...content} type="text" onBlur={()=>{
              setisFocus(false)
              console.log(defaultItem);
              setselectItem(defaultItem || '')
              
            }} onFocus={()=>setisFocus(true)}></Input>
            <Button
              theme="primary"
              block
              size="xs"
              onClick={submit}
              className="button"
              shape="round"
            >
              {t("send")}
            </Button>
          </form>
        </div>
      </div>
      <div className="reply-input-box-empty"></div>
    </>
  );
};

export default forwardRef(ReplyInput);
