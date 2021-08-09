/*
 * @Author: lmk
 * @Date: 2021-07-16 14:00:13
 * @LastEditTime: 2021-08-09 23:48:26
 * @LastEditors: lmk
 * @Description: empty page
 */
import empty from '@/images/empty.png'
import React from 'react';
import './index.scss'
import { useTranslation } from 'react-i18next';
 /**
  * @description: 
  * @param {*} img
  * @param {*} showBtn
  * @param {*} btnElement
  * @return {*}
  */
 export default function Empty({img=empty,showBtn,btnElement}){
  const {t} = useTranslation()
  return <div className="m-text-center emptyBox">
    <img alt="empty" src={img} className="emptyImg"></img>
    {!showBtn&&<p className="emptyTxt">{t('empty')}</p>}
    {showBtn&&btnElement}
  </div>
}