/*
 * @Author: lmk
 * @Date: 2022-01-05 15:51:32
 * @LastEditTime: 2022-01-12 19:09:09
 * @LastEditors: lmk
 * @Description: user following and followers
 */
import Navbar from '@/components/NavBar';
import { useRouteState } from '@/utils';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, Tabs } from 'zarm';
import Following from '../Following';
import "./index.scss";
const UserFollowPage = (props)=>{
  const [pageTitle, setpageTitle] = useState('')
  const {t} = useTranslation()
  const [value, setvalue] = useState(0)
  const [uid, setuid] = useState('')
  const state = useRouteState();
  useEffect(() => {
    // const {state} = window.history.state;
    setpageTitle(state.username)
    setvalue(Number(state.value) || 0)
    setuid(state.uid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div>
    <Navbar title={t(pageTitle)} />
    {uid&&<Tabs swipeable lineWidth={10} value={value} onChange={setvalue}>
      <Panel title={<span className={value === 0 ? 'active' : 'unactive'}>Following</span>}>
        <div className='user-follow-page'  style={{'--window-height':`${window.innerHeight}px`}}>
          <Following pageType={'following'} uid={uid}></Following>
        </div>
      </Panel>
      <Panel title={<span className={value === 1 ? 'active' : 'unactive'}>Followers</span>}>
        <div  className='user-follow-page'  style={{'--window-height':`${window.innerHeight}px`}}>
          <Following pageType={'fans'} uid={uid}></Following>
        </div>
      </Panel>
    </Tabs>}
  </div>
}
export default UserFollowPage