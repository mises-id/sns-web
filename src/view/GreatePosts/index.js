/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2021-07-16 11:32:00
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar, Button ,Input} from 'zarm';
import '@/styles/common.scss'
const GreatePosts = (props)=>{
  const {t} = useTranslation()
  return <div>
    <NavBar
      left={<span  onClick={() => window.history.back()} className="m-font16">{t('cancel')}</span>}
      right={<div style={{width:'61px'}}><Button theme="primary" block size="xs" shape="round">{t('send')}</Button></div>}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-padding15"> 
        <Input
          rows={10}
          type="text"
          className="m-font17"
          placeholder={`${t('placeholder')}...`}
        />
      </div>
    </div>
  </div>
}
export default GreatePosts