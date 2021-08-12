/*
 * @Author: lmk
 * @Date: 2021-07-15 23:43:29
 * @LastEditTime: 2021-08-12 23:08:58
 * @LastEditors: lmk
 * @Description: my post page
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/styles/followPage.scss'
import Image from '@/components/Image';
import send from '@/images/send.png'
import './index.scss'
import { deletePosts, myPostsData } from '@/api/status';
import PullList from '@/components/PullList';
import Navbar from '@/components/NavBar';
import { useSelector } from 'react-redux';
import { Toast } from 'zarm';
import { useChangePosts, useList } from '@/utils';
import PostItem from '@/components/PostItem';
const MyPosts = ({history}) => {
  const user = useSelector(state => state.user)||{}
  const deleteItem = ({id},index)=>{
    deletePosts(id).then(res=>{
      Toast.show(t('deleteSuccess'));
      dataSource.splice(index,1);
      setdataSource([...dataSource]);
      if(dataSource.length===0){ //if empty 
        setlastId('')
        fetchData()
      }
    })
  }
  const [lastId, setlastId] = useState('')
  const [fetchData,last_id,dataSource,setdataSource] = useList(myPostsData,{
    uid:user.loginForm&&user.loginForm.uid,
    limit:5,last_id:lastId
  })
  //getData
  useEffect(() => {
    setlastId(last_id)
  }, [last_id])
  const {setLike,followPress} = useChangePosts(setdataSource,dataSource);
  const createPosts = ()=>history.push({pathname:'/createPosts'})
  const {t} = useTranslation()
  //render item
  const renderView =(val={},index)=>{
    return <PostItem val={val} key={index} deleteItem={()=>deleteItem(val,index)} index={index} history={history} changeFollow={followPress} btnType="myPosts" setLike={setLike} />
  }
  return <div>
    <Navbar title={t('myPostPageTitle')}
    />
    <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
    <div className="m-position-fixed createPosts">
      <Image size={75} onClick={createPosts} source={send}></Image>
    </div>
  </div>
}
export default MyPosts