/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2021-08-24 13:56:39
 * @LastEditors: lmk
 * @Description: 
 */
import React, { useEffect, useState } from 'react';
import './index.scss'
import { useTranslation } from 'react-i18next';
import following from '@/images/following.png'
import followers from '@/images/followers.png'
import post from '@/images/post.png'
import Cell from '@/components/Cell';
import { ActivityIndicator, Button } from 'zarm';
import { useSelector } from 'react-redux';
import { getListUsersCount, OpenCreateUserPanel, openLoginPage, OpenRestoreUserPanel } from '@/utils/postMessage';
const Myself = ({ history }) => {
  const { t } = useTranslation();
  const { loginForm: user = {}, token } = useSelector(state => state.user) || {}
  const [loginForm] = useState(user)
  const [flag, setflag] = useState(false);
  const [loading, setloading] = useState(true)
  //getData
  const getFlag = async () => {
    const count = await getListUsersCount();
    setflag(count > 0)
    setloading(false)
  }
  useEffect(() => {
    getFlag()
  }, [token])
  const onclick = flag ? openLoginPage : OpenCreateUserPanel;
  const restore = OpenRestoreUserPanel
  const list = [{
    label: t('following'),
    icon: following,
    url: '/follow',
    pageType: 'following'
  }, {
    label: t('followers'),
    icon: followers,
    url: '/follow',
    pageType: 'fans'
  }, {
    label: t('posts'),
    icon: post,
    url: '/myPosts'
  }]
  //router to userInfo
  const userInfo = () => history.push('/userInfo')
  //click global cell 
  const cellClick = val => history.push({ pathname: val.url, state: { pageType: val.pageType } })
  return <div>
    {loading ? <div style={{ textAlign: 'center', padding: '20px' }}>
      <ActivityIndicator type="spinner" />
    </div> : (token ? <div className="m-layout">
      <div className="m-padding-top15  m-bg-f8f8f8"></div>
      <div className="m-padding-lr15">
        <Cell iconSize={60} icon={loginForm.avatar && loginForm.avatar.large} label={loginForm.username} onPress={userInfo}></Cell>
        {list.map((val, index) => (<Cell showLine={false} icon={val.icon} iconSize={20} key={index} label={val.label} onPress={() => cellClick(val)}></Cell>))}
      </div>
    </div> : <div className="m-flex m-flex-col m-layout">
      <div className="m-flex-1 m-padding15" style={{ height: 0, overflowY: 'auto' }}>
        <p className="m-title">{t('aboutId')}</p>
        <p className="m-font15 m-margin-top-8">
          {t('createMisesIdTips')}
        </p>
      </div>
      <div className="footer m-bg-fff m-text-center">
        <Button block shape="round" theme="primary" ghost onClick={onclick}>{t(flag ? 'loginUser' : 'createId')}</Button>
        <p className="m-padding-tb10 m-colors-666 m-font12">{t("restoreTips")}</p>
        <p className="m-font15 m-colors-5c65f6" onClick={restore}>{t("restore")}</p>
      </div>
    </div>)}

  </div>
}
export default Myself