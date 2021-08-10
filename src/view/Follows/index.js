/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2021-08-10 16:30:44
 * @LastEditors: lmk
 * @Description: 
 */
import {useEffect, useState } from 'react';
import '@/styles/followPage.scss'
import UserHeader from './UserHeader/index';
import Link from './Link';
import PostsIcons from '@/components/PostsIcons';
import PullList from '@/components/PullList';
import { liked ,followed} from '@/components/PostsIcons/common';
import { following, recommend } from '@/api/status';
import { useSelector } from 'react-redux';
import Empty from '@/components/Empty';
import { Button } from 'zarm';
import { OpenCreateUserPanel } from '@/utils/postMessage';
import { useTranslation } from 'react-i18next';
import { useList } from '@/utils';
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
  const setLike = (val)=>{
    liked(val).then(res=>{
      setdataSource([...dataSource])
    });
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
  }
  const forwardPress = (val)=>{
    history.push({pathname:'/forward'})
  }
  const followPress = (e,val)=>{
    followed(e,val).then(res=>{
      setdataSource([...dataSource])
    });
  }
  const renderView =(val={},index)=>{
    return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
      <UserHeader item={{...val.user,from_type:val.from_type}}  followed={()=>followPress(val)}></UserHeader>
      <p className="itemContent m-font15 m-padding-tb15">{val.content}</p>
      {/* example */}
      {val.status_type==='link'&&<Link theme="primary"></Link>}
      {val.from_type==='forward'&&<div className="m-bg-f8f8f8 m-padding10">
        <UserHeader item={val} size={30} followed={()=>followPress(val)}></UserHeader>
        <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
        <Link theme="white"></Link>
      </div>}
      <div className="m-margin-top12">
        <PostsIcons likeCallback={()=>setLike(val)} item={val} forwardCallback={()=>forwardPress(val)} />
      </div>
    </div>
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