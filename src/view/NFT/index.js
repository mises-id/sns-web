/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:04
 * @LastEditTime: 2022-05-16 11:08:46
 * @LastEditors: lmk
 * @Description: NFT page
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import comment_NFT from '@/images/comment_NFT.png'
import like_NFT from '@/images/like_NFT.png'
import Navbar from "@/components/NavBar";
import PullList from "@/components/PullList";
import { objToUrl, useList, useRouteState } from "@/utils";
import { Image } from "antd-mobile";
import { getMyNFTAsset, getNFTAsset } from "@/api/user";
const NFTPage = ({history}) => {
  const {t} = useTranslation();
  const NFTDetail = item=>{
    history.push({
      pathname:'/NFTDetail',
      search:objToUrl({
        tokenId:item.id,
        image:item.image_url,
      })
    })
  }

  const renderView = (val,index) => {
    return <div className="NFT" key={index}>
      <p className="NFT-series-title">{val.slugName}</p>
      <div className="m-grid grid-2">
        {Array.isArray(val.list)&&val.list.map((item, index) => {
          return (
            <div className="NFT-item" key={index} onClick={()=>{
              NFTDetail(item)
            }}>
              <Image src={item.image_preview_url} alt="" fit="cover" className="NFT-item-img"/>
              <div className="NFT-item-info">
                <p className="NFT-item-title">{item.name}</p>
                <div className="NFT-item-desc m-flex">
                  <p className="NFT-item-like NFT-item-tag">
                    <img src={like_NFT} alt="" />
                    {item.likes_count}
                  </p>
                  <p className="NFT-item-comment NFT-item-tag">
                    <img src={comment_NFT} alt="" />
                    {item.comments_count}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  }
  const state = useRouteState();
  const [lastId, setlastId] = useState("");
  const fn = state.uid ? getNFTAsset : getMyNFTAsset
  const [fetchData, last_id, dataSource] = useList(fn, {
    uid: state.uid,
    limit: 50,
    last_id: lastId,
  });
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);
  const [NFTData,setNFTData] = useState([])
  useEffect(() => {
    if(dataSource.length>0){
      const slugArr = [];
      dataSource.forEach(item => {
        const {collection:{slug}} = item;
        const hasSlug = slugArr.find(val=>val.slugName===slug)
        // group by slug
        if(hasSlug){
          hasSlug.list.push(item)
        }else{
          slugArr.push({
            slugName:slug,
            list:[item]
          })
        }
      })
      setNFTData(slugArr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource.length])
  
  return (
    <div>
      <Navbar title={t("NFTPageTitle")} />
      <PullList
        renderView={renderView}
        data={NFTData}
        load={fetchData}
      ></PullList>
    </div>
  );
};
export default NFTPage;
