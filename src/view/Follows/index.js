import { useState, useEffect, useRef } from 'react';
import { Pull } from 'zarm';
import './index.scss'
import liked from '@/images/liked.png'
import like from '@/images/like.png'
import comment from '@/images/comment.png'
import share from '@/images/share.png'
import UserHeader from './UserHeader/index';
import Link from './Link';
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
      setDataSource(fetchData(20));
      setRefreshing(REFRESH_STATE.success);
    }, 2000);
  };
  const getRandomNum = (min, max) => {
    const Range = max - min;
    const Rand = Math.random();
    return min + Math.round(Rand * Range);
  };
  const setLike = (e,val)=>{
    e.stoppropagation()
    val.liked = !val.liked;
  }
  const goDetail = ()=>{
    history.push({pathname:'/post'})
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
      <div className="m-margin-top12 m-flex itemFunctionBox">
        <div className="m-flex"  onClick={(e)=>setLike(e,val)}>
          <img src={val.liked ? liked : like}  className="iconStyle" alt="like"></img>
          <span className={`m-font12 m-margin-left8 ${val.liked ? 'm-colors-FF3D62' : 'm-colors-333'}`}>235</span>
        </div>
        <div className="m-flex">
          <img src={comment}  className="iconStyle" alt="comment"></img>
          <span className="m-font12 m-colors-333 m-margin-left8">68</span>
        </div>
        <div className="m-flex">
          <img src={share}  className="iconStyle" alt="share"></img>
          <span className="m-font12 m-colors-333 m-margin-left8">34</span>
        </div>
      </div>
    </div>
  }
  //getData
  const fetchData = (length, dataSource = []) => {
    let newData = [].concat(dataSource);
    const startIndex = newData.length;
    for (let i = startIndex; i < startIndex + length; i++) {
      newData.push(renderView({},i));
    }
    return newData;
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
        setDataSource(fetchData(20, dataSource));
      }

      setLoading(loadingState);
    }, 2000);
  };

  useEffect(() => {
    setDataSource(fetchData(20));
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
      {dataSource}
    </Pull>
    </div>
  );
};
export default Follow;