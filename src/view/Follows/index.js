/*
 * @Author: lmk
 * @Date: 2021-07-08 15:07:17
 * @LastEditTime: 2021-08-06 13:10:34
 * @LastEditors: lmk
 * @Description: 
 */
import { useState } from 'react';
import '@/styles/followPage.scss'
import UserHeader from './UserHeader/index';
import Link from './Link';
import PostsIcons from '@/components/PostsIcons';
import PullList from '@/components/PullList';
import { liked ,followed} from '@/components/PostsIcons/common';
const Follow = ({history}) => {
  const [dataSource, setDataSource] = useState([]);
  const setLike = (e,val)=>{
    liked(e,val).then(res=>{
      setDataSource([...dataSource])
    });
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
  }
  const forwardPress = (e,val)=>{
    e.stopPropagation();
    history.push({pathname:'/forward'})
  }
  const followPress = (e,val)=>{
    followed(e,val).then(res=>{
      setDataSource([...dataSource])
    });
  }
  const renderView =(val={},index)=>{
    return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
      <UserHeader item={val}  followed={(e)=>followPress(e,val)}></UserHeader>
      <p className="itemContent m-font15 m-padding-tb15">It's a great website, share with you. Wow!!! Come and play with me.</p>
      {/* example */}
      {index===0&&<Link theme="primary"></Link>}
      {index===1&&<div className="m-bg-f8f8f8 m-padding10">
        <UserHeader item={val} size={30} followed={(e)=>followPress(e,val)}></UserHeader>
        <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
        <Link theme="white"></Link>
        </div>}
      <div className="m-margin-top12">
        <PostsIcons likePress={setLike} item={val} forwardPress={forwardPress}></PostsIcons>
      </div>
    </div>
  }
  //getData
  const fetchData = async () => {
    const newData = [];
    for (let i = 0; i < 10; i++) {
      newData.push({id:dataSource.length+i});
    }
    setDataSource([...dataSource,...newData])
    return Promise.resolve()
  };
  return (
    <PullList className="followBox" renderView={renderView} data={dataSource} load={fetchData}></PullList>
  );
};
export default Follow;