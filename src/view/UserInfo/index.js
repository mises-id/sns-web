/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:04
 * @LastEditTime: 2021-07-15 13:38:58
 * @LastEditors: lmk
 * @Description: UserInfo page
 */
import Cell from '@/components/Cell';
import Image from '@/components/Image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Input, NavBar } from 'zarm';
import './index.scss'
const UserInfo = (props)=>{
  const {t} = useTranslation()
  return <div>
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t('userInfoPageTitle')}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-bg-fff">
        <Cell label={t('avatar')} className='m-padding-lr15' showIcon={false}
        rightChild={<Image size={35}></Image>}></Cell>
        <Cell label={t('username')} className='m-padding-lr15' showIcon={false}
        rightChild={<Input type="text" placeholder={t('placeholder')} />}></Cell>
        <Cell label={t('gender')} className='m-padding-lr15' showIcon={false}
        rightChild={<Input type="text" placeholder={t('placeholder')} />}></Cell>
        <Cell label={t('phone')} className='m-padding-lr15' showIcon={false}
        rightChild={<Input type="text" placeholder={t('placeholder')} />}></Cell>
        <Cell label={t('mail')} className='m-padding-lr15' showIcon={false}
        rightChild={<Input type="text" placeholder={t('placeholder')} />}></Cell>
        <Cell label={t('address')} className='m-padding-lr15' showIcon={false}
        rightChild={<Input type="text" placeholder={t('placeholder')} />}></Cell>
      </div>
    </div>
  </div>
}
export default UserInfo
