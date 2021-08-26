/*
 * @Author: lmk
 * @Date: 2021-07-15 13:41:35
 * @LastEditTime: 2021-08-26 13:29:48
 * @LastEditors: lmk
 * @Description: Following and Followers page
 */
import Cell from '@/components/Cell';
import React, {  useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import friend from '@/images/friend.png' //friend
import following from '@/images/followed.png' // my follow
import fans from '@/images/fans.png' //fans
import './index.scss';
import { useLocation } from 'react-router-dom';
import { friendShip } from '@/api/fans';
import { useSelector } from 'react-redux';
import PullList from '@/components/PullList';
import Navbar from '@/components/NavBar';
import { useList } from '@/utils';
import { followed } from '@/components/PostsIcons/common';
const Following = ({history})=>{
  const {t} = useTranslation();
  const location = useLocation();
  const {state={}} = location || {}
  const type = state.pageType || 'following'
  const pageTitle = `${type}PageTitle`
  const user = useSelector(state => state.user)||{};
  const renderView =(val={},index)=>{
    const user = val.user;
    const icon = {
      following: following,
      fan: fans,
      friend: friend,
    }[val.relation_type];
    const setFollow = async ()=>{
      const followFlag = val.relation_type==='fan' // 为粉丝则没有互相关注
      try {
        const followObj = {user:{uid:val.user.uid,is_followed:!followFlag}};
        await followed(followObj);
        if(val.relation_type==='fan'){
          const followType = type==='following'&&val.old_relation_type!=='friend' ? 'following' : 'friend';
          setData(followType)
          return false;
        }
        setData('fan') 
      } catch (error) {
        console.log(error)
      }
    }
    const setData = (type,index)=>{
      if(!val.old_relation_type) val.old_relation_type = val.relation_type 
      val.relation_type = type;
      dataSource[index] = val;
      //dataSource.splice(index,1);
      setdataSource([...dataSource])
    }
    return <Cell iconSize={35} className="m-bg-fff m-padding-lr15 m-padding-tb12" showArrow={false} label={user.username} key={index}
    icon={user.avatar?user.avatar.medium:''}
    rightChild={<img onClick={setFollow} className="followedIcon" src={icon} alt="followIcon" />}></Cell>
  }
  const [lastId, setlastId] = useState('')
  const [fetchData,last_id,dataSource,setdataSource] = useList(friendShip,{
    uid:user.loginForm&&user.loginForm.uid,relation_type:type,
    limit:5,last_id:lastId
  })
  //getData
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  return <div>
    <Navbar title={t(pageTitle)}/>
    <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
  </div>
}
export default Following