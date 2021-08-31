/*
 * @Author: lmk
 * @Date: 2021-07-08 15:08:05
 * @LastEditTime: 2021-08-30 23:04:35
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
import bg from '@/images/me-bg.png';
const Myself = ({ history }) => {
  const { t } = useTranslation();
  const { loginForm: user = {}, token } = useSelector(state => state.user) || {}
  const [loginForm] = useState(user)
  const [flag, setflag] = useState(false);
  const [loading, setloading] = useState(true)
  //getData
  const getFlag = async () => {
    const {data:count} = await getListUsersCount();
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
      <div className="m-padding-lr15  m-bg-fff">
        <Cell iconSize={60} 
        icon={loginForm.avatar && loginForm.avatar.large} 
        label={loginForm.username || 'Anonymous'} 
        labelStyle={{fontSize:'23px',fontWeight:'bold'}}
        onPress={userInfo}/>
        {list.map((val, index) => (<Cell shape="square" showLine={false} icon={val.icon} iconSize={20} key={index} label={val.label} onPress={() => cellClick(val)}></Cell>))}
      </div>
    </div> : <div className=" m-layout m-bg-fff">
      <img alt="bg" src={bg} className="bg"/>
      <div className="m-margin-left15 m-margin-bottom25">
        <p className="nickname m-margin-top15 m-margin-bottom20 m-colors-333">{t('aboutId')}</p>
        <p className="m-font15 m-colors-333 m-margin-top8 m-padding-right24 m-tips">{t('createMisesIdTips')} </p>
      </div>
      <div className="m-margin-lr40">
        <div className="m-padding-top25">
          <Button block shape="round" theme="primary"  onClick={onclick}>{t(flag ? 'loginUser' : 'createId')}</Button>
        </div>
        <div className="m-padding-top25">
          <Button block shape="round" theme="primary" ghost onClick={restore}>{t('restore')}</Button>
        </div>
      </div>
    </div>)}

  </div>
}
export default Myself