/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2021-08-11 01:53:07
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input ,Icon} from 'zarm';
import '@/styles/followPage.scss'
import write from '@/images/write.png'
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import './index.scss'
import Image from '@/components/Image';
import PostsIcons from '@/components/PostsIcons';
import { followed, liked } from '@/components/PostsIcons/common';
import Navbar from '@/components/NavBar';
import {  getComment, getStatusItem } from '@/api/status';
import { useBind } from '@/utils';
const Post = ({history})=>{
  const {t} = useTranslation();
  const [item,setitem] = useState({})
  const goComment = ()=>{
    history.push({pathname:'/comment'})
  }
  const setLike = ()=>{
    liked(item).then(res=>{
      setitem({...item})
    });
  }
  const followPress = ()=>{
    followed(item).then(res=>{
      setitem({...item})
    });
  }
  const forwardPress = val=>{
    history.push({pathname:'/forward',state:{id:val.id}})
  }
  const getDetail = id=>{
    getStatusItem(id).then(res=>{
      setitem(res);
    })
  }
  const [comment, setcomment] = useState([])
  const getCommentList = id=>{
    getComment({status_id:id,limit:3}).then(res=>{
      setcomment(res.data)
    })
  }
  const [id, setid] = useState('');
  const commentContent = useBind('')
  useEffect(() => {
    const state = history.location.state || {};
    setid(state.id);
    getDetail(state.id)
    getCommentList(state.id)
  }, [history.location.state])
  const submit = ()=>{
    console.log(commentContent)
  }
  return <div>
    <Navbar title={t('postPageTitle')}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-bg-fff">
        <div  className="m-padding15 m-bg-fff m-line-bottom">
        <UserHeader item={{...item.user,from_type:item.from_type}}  followed={followPress}></UserHeader>
          <p className="itemContent m-font15 m-padding-tb15">{item.content}</p>
          {item.status_type==='link'&&<Link theme="primary"></Link>}
          {item.from_type==='forward'&&<div className="m-bg-f8f8f8 m-padding10">
            <UserHeader item={item} size={30} followed={()=>followPress(item)}></UserHeader>
            <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
            <Link theme="white"></Link>
          </div>}
          <div className="m-margin-top12">
            <PostsIcons likeCallback={setLike} item={item} forwardCallback={forwardPress} />
          </div>
        </div>
      </div>
      <div className="m-margin-top15 m-bg-fff m-padding15">
        <div className="m-flex">
          <Image size={30}></Image>
          <div className="comment m-flex-1 m-flex m-padding-lr15">
            <div className="m-margin-right5"><Image source={write} size={16} shape="square"></Image></div>
            <Input placeholder="Write a comment..." {...commentContent} type="text"></Input>
          </div>
        </div>
        {comment.map((val,index)=>(<div key={index} className="m-flex m-col-top m-padding-top10">
          <Image size={30}></Image>
          <div className="m-margin-left12 m-line-bottom">
            <span className="commentNickname">Emma</span>
            <p className="m-font15 m-colors-555  m-padding-bottom10">It's a great website, share with you. Wow!!! Come and play with me.</p>
          </div>
        </div>))}
        {comment.length ? <div className="footerBtn">
          <Button shape="round" size="sm" theme="primary" ghost block onClick={goComment}>
          <div className="m-flex m-row-center">{t('lookAtAll')}<Icon type="arrow-right" theme="primary" size="xs"></Icon></div>
          </Button>
        </div>:''}
      </div>
    </div>
  </div>
}
export default Post