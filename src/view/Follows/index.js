/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2021-08-26 23:01:25
 * @LastEditors: lmk
 * @Description: 
 */
import { useEffect, useState } from 'react';
import PullList from '@/components/PullList';
import { following, recommend } from '@/api/status';
import { useSelector } from 'react-redux';
import Empty from '@/components/Empty';
import { ActivityIndicator, Button } from 'zarm';
import { getListUsersCount, OpenCreateUserPanel, openLoginPage } from '@/utils/postMessage';
import { useTranslation } from 'react-i18next';
import { useChangePosts, useList } from '@/utils';
import PostItem from '@/components/PostItem';
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
  const [flag, setflag] = useState(false);
  //getData
  const getFlag = async () => {
    try {
      const {data:count} = await getListUsersCount();
      setflag(count > 0)
      setloading(false)
    } catch (error) {
      console.log(error,'wwwwwww')
    }
  }
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  useEffect(() => {
    setisDiscover(isDiscoverPage.indexOf('discover') > -1);
    if (!isDiscover) getFlag();
  }, [isDiscover, isDiscoverPage])
  const { setLike, followPress } = useChangePosts(setdataSource, dataSource);
  const renderView = (val = {}, index) => {
    return <PostItem val={val} key={index} index={index} history={history} changeFollow={followPress} setLike={setLike} />
  }
  const { t } = useTranslation()
  const btnElement = () => {
    const onclick = flag ? openLoginPage : OpenCreateUserPanel;
    return <div className="create-btn"><Button block shape="round" theme="primary" ghost onClick={onclick}>{t(flag ? 'loginUser' : 'createId')}</Button></div>
  }
  return <div>
    {loading ? 
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <ActivityIndicator type="spinner" />
      </div> 
      : (!isDiscover && !user.token ? <Empty showBtn btnElement={btnElement()} /> : <PullList className="followBox" renderView={renderView} data={dataSource} load={fetchData}></PullList>
    )
    }
  </div>

};
export default Follow;