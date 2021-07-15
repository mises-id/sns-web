/*
 * @Author: lmk
 * @Date: 2021-07-15 10:45:52
 * @LastEditTime: 2021-07-15 16:42:08
 * @LastEditors: lmk
 * @Description: create mises page
 */
import './index.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'zarm';
const list = [1,2,2,4,2,2,2,3,2,2] //test
const CreateMisesId = (props)=>{
  const {t} = useTranslation()
  return <div className="m-flex m-flex-col m-layout">
    <div className="m-flex-1 m-padding15" style={{height:0,overflowY:'auto'}}>
      <p className="m-title">{t('aboutId')}</p>
      {list.map((val,index)=>(<p key={index} className="m-font15 m-margin-top-8">This is the introduction. This is the introduction. This 
is the introduction. This is the introduction. This is the
 introduction. This is the introduction. </p>))}
    </div>
    <div className="footer m-bg-fff m-text-center">
      <Button block shape="round" theme="primary" ghost>{t('createId')}</Button>
      <p className="m-padding-tb10 m-colors-666 m-font12">{t("restoreTips")}</p>
      <p className="m-font15 m-colors-5c65f6">{t("restore")}</p>
    </div>
  </div>
}
export default CreateMisesId