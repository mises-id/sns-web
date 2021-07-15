/*
 * @Author: lmk
 * @Date: 2021-07-15 14:48:08
 * @LastEditTime: 2021-07-15 16:43:28
 * @LastEditors: lmk
 * @Description: post detail
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input, NavBar } from 'zarm';
import liked from '@/images/liked.png'
import like from '@/images/like.png'
import comment from '@/images/comment.png'
import write from '@/images/write.png'
import share from '@/images/share.png'
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import './index.scss'
import Image from '@/components/Image';
const Post = ({history})=>{
  const {t} = useTranslation();
  const [item] = useState({})
  const commentList = [{},{},{}]
  const goComment = ()=>{
    history.push({pathname:'/comment'})
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
          <div className="m-margin-top12 m-flex itemFunctionBox">
            <div className="m-flex">
              <img src={item.liked ? liked : like}  className="iconStyle" alt="like"></img>
              <span className={`m-font12 m-margin-left8 ${item.liked ? 'm-colors-FF3D62' : 'm-colors-333'}`}>235</span>
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