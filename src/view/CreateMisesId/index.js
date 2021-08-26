/*
 * @Author: lmk
 * @Date: 2021-07-15 10:45:52
 * @LastEditTime: 2021-08-26 23:02:25
 * @LastEditors: lmk
 * @Description: create mises page
 */
import './index.scss';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'zarm';
import { getListUsersCount, OpenCreateUserPanel, openLoginPage, OpenRestoreUserPanel } from '@/utils/postMessage';
const CreateMisesId = (props)=>{
  const {t} = useTranslation();
  const [flag, setflag] = useState(false);
  //getData
  const getFlag = async () =>{
    const {data:count} = await getListUsersCount();
    setflag(count > 0)
  }
  useEffect(() => {
    getFlag()
  }, [])
  const onclick = flag ? openLoginPage : OpenCreateUserPanel;
  const restore = ()=>{
    OpenRestoreUserPanel()
  }
  return <div className="m-flex m-flex-col m-layout">
    <div className="m-flex-1 m-padding15" style={{height:0,overflowY:'auto'}}>
      <p className="m-title">{t('aboutId')}</p>
      <p className="m-font15 m-margin-top-8">
        {t('createMisesIdTips')}
      </p>
    </div>
    <div className="footer m-bg-fff m-text-center">
      <Button block shape="round" theme="primary" ghost onClick={onclick}>{t(flag ? 'loginUser' :'createId')}</Button>
      <p className="m-padding-tb10 m-colors-666 m-font12">{t("restoreTips")}</p>
      <p className="m-font15 m-colors-5c65f6" onClick={restore}>{t("restore")}</p>
    </div>
  </div>
}
export default CreateMisesId