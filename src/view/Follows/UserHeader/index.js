import Image from '@/components/Image/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from 'zarm';
const UserHeader = ({size})=>{
  const {t} = useTranslation()
  return <div className={`m-flex m-row-between ${size ? 'forward' :'normal'}`}>
    <div className="m-flex">
      <Image size={size}/>
      <div className={!size ? 'm-margin-left12':'m-margin-left-8'}>
        <span className='nickname'>Alice</span>
        <div className="timeAndType m-margin-top8">05.25<span className="m-margin-left5">post</span></div>
      </div>
    </div>
    <Button icon={<Icon type="add" className="followIcon" theme="primary" />} shape="round" theme="primary" ghost size="xs">
      <div className="m-font12">{t('followTxt')}</div>
    </Button>
  </div>
}
export default UserHeader