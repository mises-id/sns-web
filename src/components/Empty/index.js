/*
 * @Author: lmk
 * @Date: 2021-07-16 14:00:13
 * @LastEditTime: 2021-07-16 14:10:49
 * @LastEditors: lmk
 * @Description: empty page
 */
import empty from '@/images/empty.png'
import React from 'react';
import './index.scss'
import { useTranslation } from 'react-i18next';
const Empty = (props)=>{
  const {t} = useTranslation()
  return <div className="m-text-center emptyBox">
    <img alt="empty" src={empty} className="emptyImg"></img>
    <p className="emptyTxt">{t('empty')}</p>
  </div>
}
export default Empty