/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2021-08-30 22:37:39
 * @LastEditors: lmk
 * @Description: 
 */
import { useEffect, useState } from 'react';
import PullList from '@/components/PullList';
import { following, recommend } from '@/api/status';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'zarm';
import { useTranslation } from 'react-i18next';
import { useChangePosts, useList } from '@/utils';
import PostItem from '@/components/PostItem';
import emptyIcon from '@/images/nothing.png';
import './index.scss'
const Follow = ({ history = {} }) => {
  const user = useSelector(state => state.user) || {}
  const isDiscoverPage = history.location ? history.location.pathname : '';
  const [isDiscover, setisDiscover] = useState(false)
  const fn = isDiscoverPage.indexOf('discover') > -1 ? recommend : following;
  const [lastId, setlastId] = useState('')
  const [loading, setloading] = useState(true)
  const [fetchData, last_id, dataSource, setdataSource] = useList(fn, {
    uid: user.loginForm && user.loginForm.uid,
    limit: 20, last_id: lastId
  })
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  useEffect(() => {
    setisDiscover(isDiscoverPage.indexOf('discover') > -1);
    setloading(false)
  }, [isDiscover, isDiscoverPage])
  const { setLike, followPress } = useChangePosts(setdataSource, dataSource);
  const renderView = (val = {}, index) => {
    return <div style={index===0 ? {marginTop:'10px'} : {}} key={index}><PostItem val={val} key={index} index={index} history={history} changeFollow={followPress} setLike={setLike} /></div>
  }
  const { t } = useTranslation()
  const find = () =>{
    history.push('/home/discover')
  }
  const btnElement = () => {
    return <div className="empty-box">
      <img src={emptyIcon} alt="" className="empty-icon"/>
      <p className="m-colors-333 m-title m-margin-bottom20">{t('unloginFollowingTitle')}</p>
      <p className="m-font15 m-colors-666">{t('unloginFollowingsecTitle')}</p>
      <div className="find m-font14" onClick={find}>{t('findAccounts')}</div>
    </div>
  }
  return <div>
    {loading ? 
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <ActivityIndicator type="spinner" />
      </div> 
      : (!isDiscover && !user.token ? btnElement() : <PullList  renderView={renderView} data={dataSource} load={fetchData}></PullList>
    )
    }
  </div>

};
export default Follow;