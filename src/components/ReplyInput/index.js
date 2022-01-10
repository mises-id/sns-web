/*
 * @Author: lmk
 * @Date: 2021-12-06 09:34:18
 * @LastEditTime: 2022-01-10 17:25:04
 * @LastEditors: lmk
 * @Description: 
 */
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "zarm";
import "./style.scss";
const ReplyInput = ({submit,content,placeholder},ref) => {
  const {t} = useTranslation();
  return (
    <div className="reply-input-box m-line-top" >
      <form onSubmit={submit} className="m-flex-1 m-flex">
        <Input placeholder={placeholder||t('commentPlaceholder')} ref={ref} className="input" clearable={false} {...content} type="text"></Input>
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
  );
};

export default forwardRef(ReplyInput);
