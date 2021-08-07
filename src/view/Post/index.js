/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2021-07-23 15:11:58
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input, NavBar } from 'zarm';
import '@/styles/followPage.scss'
import write from '@/images/write.png'
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import './index.scss'
import Image from '@/components/Image';
import PostsIcons from '@/components/PostsIcons';
import { liked } from '@/components/PostsIcons/common';
const Post = ({history})=>{
  const {t} = useTranslation();
  const [item,setitem] = useState({})
  const commentList = [{},{},{}]
  const goComment = ()=>{
    history.push({pathname:'/comment'})
  }
  const setLike = (e,val)=>{
    liked(e,val).then(res=>{
      setitem({...val})
    });
  }
  return <div>
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t('postPageTitle')}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-bg-fff">
        <div  className="m-padding15 m-bg-fff m-line-bottom">
          <UserHeader></UserHeader>
          <p className="itemContent m-font15 m-padding-tb15">It's a great website, share with you. Wow!!! Come and play with me.</p>
          <div className="m-bg-f8f8f8 m-padding10">
            <UserHeader size={30}></UserHeader>
            <p className="itemContent m-font13 m-padding-tb10">It's a great website, share with you. Wow!!! Come and play with me.</p>
            <Link theme="white"></Link>
          </div>
          <div className="m-margin-top12">
            <PostsIcons likePress={setLike} item={item}></PostsIcons>
          </div>
        </div>
      </div>
      <div className="m-margin-top15 m-bg-fff m-padding15">
        <div className="m-flex">
          <Image size={30}></Image>
          <div className="comment m-flex-1 m-flex m-padding-lr15">
            <div className="m-margin-right5"><Image source={write} size={16} shape="square"></Image></div>
            <Input placeholder="Write a comment..." type="text"></Input>
          </div>
        </div>
        {commentList.map((val,index)=>(<div key={index} className="m-flex m-col-top m-padding-top10">
          <Image size={30}></Image>
          <div className="m-margin-left12 m-line-bottom">
            <span className="commentNickname">Emma</span>
            <p className="m-font15 m-colors-555  m-padding-bottom10">It's a great website, share with you. Wow!!! Come and play with me.</p>
          </div>
        </div>))}
        <div className="footerBtn">
          <Button shape="round" size="sm" theme="primary" ghost block onClick={goComment}>
          <div className="m-flex m-row-center">{t('lookAtAll')}<Icon type="arrow-right" theme="primary" size="xs"></Icon></div>
          </Button>
        </div>
      </div>
    </div>
  </div>
}
export default Post