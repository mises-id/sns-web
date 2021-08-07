/*
 * @Author: lmk
 * @Date: 2021-07-15 16:07:01
 * @LastEditTime: 2021-07-23 12:33:48
 * @LastEditors: lmk
 * @Description: comment
 */

import './index.scss';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Input, NavBar } from 'zarm';
import Image from '@/components/Image';
import write from '@/images/write.png'
import PullList from '@/components/PullList';

const Comment = (props)=>{
  const {t} = useTranslation()
  const [dataSource, setDataSource] = useState([]);
  const renderView =(val={},index)=>{
    return <div key={index} className="m-flex m-col-top m-padding-top10">
    <Image size={30}></Image>
    <div className="m-margin-left12 m-line-bottom">
      <span className="commentNickname">Emma</span>
      <p className="m-font15 m-colors-555  m-padding-bottom10 m-padding-right15">It's a great website, share with you. Wow!!! Come and play with me.</p>
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
  return <div className="m-flex m-flex-col page">
    <NavBar
      left={<Icon type="arrow-left" size="sm" onClick={() => window.history.back()} />}
      title={t('commentPageTitle')}
    />
    <div className="m-padding-left15 m-flex-1 commentBox">
      <PullList renderView={renderView} data={dataSource} load={fetchData}></PullList>
    </div>
    <div className="footer m-bg-fff">
      <div className="m-flex">
        <Image size={30}></Image>
        <div className="comment m-flex-1 m-flex m-padding-lr15">
          <div className="m-margin-right5"><Image source={write} size={16} shape="square"></Image></div>
          <Input placeholder="Write a comment..." type="text"></Input>
        </div>
      </div>
    </div>
  </div>
}
export default Comment