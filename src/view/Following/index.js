/*
 * @Author: lmk
 * @Date: 2021-07-15 13:41:35
 * @LastEditTime: 2021-08-06 10:19:52
 * @LastEditors: lmk
 * @Description: Following and Followers page
 */
import Cell from '@/components/Cell';
import React, {  useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, NavBar } from 'zarm';
import followed from '@/images/followed.png' //mutual following
// import follow from '@/images/follow.png' //follow
// import following from '@/images/isfollow.png' //following
import './index.scss';
import { useLocation } from 'react-router-dom';
import { friendShip } from '@/api/fans';
import { useSelector } from 'react-redux';
import PullList from '@/components/PullList';
const Following = ({history})=>{
  const {t} = useTranslation();
  const location = useLocation();
  const {state={}} = location || {}
  const type = state.pageType || 'following'
  const pageTitle = `${type}PageTitle`
  const [dataSource, setDataSource] = useState([]);
  const user = useSelector(state => state.user)
  const renderView =(val={},index)=>{
    return <Cell iconSize={35} className="m-bg-fff m-padding-lr15 m-padding-tb12" showArrow={false} label={val.username} key={index}
    rightChild={<img className="followedIcon" src={followed} alt="followIcon"  icon={val.avatar.medium}/>}></Cell>
  }
  //getData
  const fetchData = async () => {
    try {
      const res = await friendShip({
        uid:user.loginForm.uid,
        relate:type,
        page:1
      })
      const userList = res.data.map(val=>val.user)
      setDataSource([...dataSource,...userList]);
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(222)
    }
  };
  return <div>
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t(pageTitle)}
    />
    <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
  </div>
}
export default Following