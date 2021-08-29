/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2021-08-29 22:58:53
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input ,Icon, Toast, Loading} from 'zarm';
import write from '@/images/write.png'
import './index.scss'
import Image from '@/components/Image';
import Navbar from '@/components/NavBar';
import {  getComment, getStatusItem } from '@/api/status';
import { useBind, useChangePosts, useRouteState } from '@/utils';
import { useSelector } from 'react-redux';
import { createComment } from '@/api/comment';
import PostItem from '@/components/PostItem';
const Post = ({history={}})=>{
  const {t} = useTranslation();
  const [item,setitem] = useState('')
  const [source, setsource] = useState('');
  const user = useSelector(state => state.user)||{};
  const [loading, setloading] = useState(false)
  const {setLike,followPress} = useChangePosts(setitem,item);
  const goComment = ()=>{
    history.push({pathname:'/comment',state:{id}})
  }
  const getDetail = id=>{
    getStatusItem(id).then(res=>{
      setitem(res)
      Loading.hide()
    })
  }
  const [comment, setcomment] = useState([]);
  const [showMore, setshowMore] = useState(false)
  const getCommentList = id=>{
    getComment({status_id:id,limit:3}).then(res=>{
      setcomment(res.data)
      setshowMore(!!res.pagination.last_id)
    })
  }
  const [id, setid] = useState('');
  const commentContent = useBind('')
  const historyState = useRouteState(history);

  useEffect(() => {
    if(user.loginForm&&user.loginForm.avatar){
      setsource(user.loginForm.avatar.medium)
    }
    if(historyState) {
      Loading.show()
      setid(historyState.id);
      getDetail(historyState.id)
      getCommentList(historyState.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyState]);
  const submit = e=>{
    e.preventDefault();
    if(!user.token){
      Toast.show(t('notLogin'))
      return false;
    }
    if(loading || !commentContent.value){
      return false
    }
    setloading(true);
    createComment({
      content:commentContent.value,
      status_id:id
    }).then(res=>{
      comment.unshift(res);
      comment.length>3&&setshowMore(true);
      setcomment(comment.slice(0,3));
      commentContent.onChange('')
    }).finally(()=>{
      setloading(false);
    })
  }
  return <div>
    <Navbar title={t('postPageTitle')}  />
    {item&&<div className="m-layout">
      <div className="m-bg-fff">
        <PostItem val={item} history={history} type="detail" changeFollow={followPress} setLike={setLike} />
      </div>
      <div className="m-margin-top10 m-bg-fff m-padding15">
        <div className="m-flex">
          <Image size={30} source={source}></Image>
          <div className="comment m-flex-1 m-flex m-padding-lr15">
            <div className="m-margin-right5"><Image source={write} size={16} shape="square"></Image></div>
            <form onSubmit={submit} className="m-flex-1">
              <Input placeholder="Write a comment..." className="input" clearable={false} {...commentContent} type="text"></Input>
            </form>
          </div>
        </div>
        {comment.map((val,index)=>(<div key={index}  className="m-flex m-col-top m-padding-top13 m-bg-fff">
          <Image size={30} source={val.user.avatar ? val.user.avatar.medium : ''}></Image>
          <div className="m-margin-left11 m-line-bottom m-flex-1">
            <span className="commentNickname">{val.user.username || 'Anonymous'}</span>
            <p className="m-font15 m-colors-555 m-margin-top12 content  m-padding-bottom13">{val.content}</p>
          </div>
        </div>))}
        {showMore ? <div className="footerBtn">
          <Button shape="round" size="sm" theme="primary" ghost block onClick={goComment}>
          <div className="m-flex m-row-center">{t('lookAtAll')}<Icon type="arrow-right" theme="primary" size="xs"></Icon></div>
          </Button>
        </div>:''}
      </div>
    </div>}
  </div>
}
export default Post