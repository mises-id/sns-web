/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2021-07-16 13:46:28
 * @LastEditors: lmk
 * @Description: Forward page
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar, Button ,Input} from 'zarm';
import '@/styles/common.scss'
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
const Forward = (props)=>{
  const {t} = useTranslation()
  return <div>
    <NavBar
      left={<span  onClick={() => window.history.back()} className="m-font16">{t('cancel')}</span>}
      right={<div style={{width:'61px'}}><Button theme="primary" block size="xs" shape="round">{t('send')}</Button></div>}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-padding15"> 
        <Input
          type="text"
          rows={5}
          className="m-font17"
          placeholder={`${t('placeholder')}...`}
        />
        <div className="m-bg-fff m-padding10 m-margin-top10">
          <UserHeader size={30}></UserHeader>
          <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
            <Link></Link>
        </div>
      </div>
    </div>
  </div>
}
export default Forward