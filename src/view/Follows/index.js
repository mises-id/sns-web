/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2021-08-12 22:59:53
 * @LastEditors: lmk
 * @Description: 
 */
import {useEffect, useState } from 'react';
import PullList from '@/components/PullList';
import { following, recommend } from '@/api/status';
import { useSelector } from 'react-redux';
import Empty from '@/components/Empty';
import { Button } from 'zarm';
import { OpenCreateUserPanel } from '@/utils/postMessage';
import { useTranslation } from 'react-i18next';
import { useChangePosts, useList } from '@/utils';
import PostItem from '@/components/PostItem';
const Follow = ({history={}}) => {
  const user = useSelector(state => state.user)||{}
  const isDiscoverPage = history.location?history.location.pathname : '';
  const [isDiscover, setisDiscover] = useState(false)
  const fn = isDiscoverPage.indexOf('discover')>-1 ? recommend : following;
  const [lastId, setlastId] = useState('')
  const [fetchData,last_id,dataSource,setdataSource] = useList(fn,{
    uid:user.loginForm&&user.loginForm.uid,
    limit:5,last_id:lastId
  })
  //getData
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  useEffect(() => {
    setisDiscover(isDiscoverPage.indexOf('discover')>-1);
  }, [isDiscoverPage])
  const {setLike,followPress} = useChangePosts(setdataSource,dataSource);
  const renderView =(val={},index)=>{
    return <PostItem val={val} key={index} index={index} history={history} changeFollow={followPress} setLike={setLike} />
  }
  const create = OpenCreateUserPanel;
  const {t} = useTranslation()
  const btnElement = ()=>{
    return <div className="create-btn"><Button block shape="round" theme="primary" ghost onClick={create}>{t('createId')}</Button></div>
  }
  return (
    !isDiscover&&!user.token ? <Empty showBtn btnElement={btnElement()}/> : <PullList className="followBox" renderView={renderView} data={dataSource} load={fetchData}></PullList>
  );
};
export default Follow;