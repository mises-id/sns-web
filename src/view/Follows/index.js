import { useState, useEffect, useRef } from 'react';
import { Pull } from 'zarm';
import '@/styles/followPage.scss'
import UserHeader from './UserHeader/index';
import Link from './Link';
import PostsIcons from '@/components/PostsIcons';
import Empty from '@/components/Empty';
const REFRESH_STATE = {
  normal: 0, 
  pull: 1, 
  drop: 2, 
  loading: 3, 
  success: 4, 
  failure: 5, 
};

const LOAD_STATE = {
  normal: 0, 
  abort: 1, 
  loading: 2, 
  success: 3, 
  failure: 4, 
  complete: 5, 
};



let mounted = true;

const Follow = ({history}) => {
  const pullRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  // 模拟请求数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    setTimeout(() => {
      if (!mounted) return;
      fetchData(20)
      setRefreshing(REFRESH_STATE.success);
    }, 2000);
  };
  const getRandomNum = (min, max) => {
    const Range = max - min;
    const Rand = Math.random();
    return min + Math.round(Rand * Range);
  };
  const setLike = (e,val)=>{
    e.stopPropagation()
    val.liked = !val.liked;
    const findIndex = dataSource.findIndex(item=>item.id===val.id);
    if(findIndex!==-1) {
      dataSource[findIndex] = val;
      setDataSource([...dataSource])
    }
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
  }
  const forwardPress = (e,val)=>{
    e.stopPropagation();
    history.push({pathname:'forward'})
  }
  const renderView =(val={},index)=>{
    return <div key={index} className="m-padding15 m-bg-fff m-line-bottom" onClick={()=>goDetail(val)}>
      <UserHeader></UserHeader>
      <p className="itemContent m-font15 m-padding-tb15">It's a great website, share with you. Wow!!! Come and play with me.</p>
      {/* example */}
      {index===0&&<Link theme="primary"></Link>}
      {index===1&&<div className="m-bg-f8f8f8 m-padding10">
        <UserHeader size={30}></UserHeader>
        <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
        <Link theme="white"></Link>
        </div>}
      <div className="m-margin-top12">
        <PostsIcons likePress={setLike} item={val} forwardPress={forwardPress}></PostsIcons>
      </div>
    </div>
  }
  //getData
  const fetchData = (length) => {
    const newData = [];
    for (let i = 0; i < length; i++) {
      newData.push({id:dataSource.length+i});
    }
    setDataSource([...dataSource,...newData])
  };
  // 模拟加载更多数据
  const loadData = () => {
    setLoading(LOAD_STATE.loading);
    setTimeout(() => {
      if (!mounted) return;
      const randomNum = getRandomNum(0, 5);
      console.log(`状态: ${randomNum === 0 ? '失败' : randomNum === 1 ? '完成' : '成功'}`);

      let loadingState = LOAD_STATE.success;
      if (randomNum === 0) {
        loadingState = LOAD_STATE.failure;
      } else if (randomNum === 1) {
        loadingState = LOAD_STATE.complete;
      } else {
        fetchData(20)
      }
      setLoading(loadingState);
    }, 2000);
  };
  useEffect(() => {
    //fetchData(20)
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="followBox">
      <Pull
      ref={pullRef}
      className="m-layout"
      style={{paddingTop:'10px'}}
      refresh={{
        state: refreshing,
        handler: refreshData,
      }}
      load={{
        state: loading,
        distance: 200,
        handler: loadData,
      }}>
      {dataSource.map(renderView)}
      {loading!==2&&<Empty></Empty>}

    </Pull>
    </div>
  );
};
export default Follow;