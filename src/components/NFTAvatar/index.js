/*
 * @Author: lmk
 * @Date: 2022-05-09 17:53:04
 * @LastEditTime: 2022-05-13 16:56:17
 * @LastEditors: lmk
 * @Description: 
 */
import { Avatar} from 'antd-mobile'
import React from 'react';
import './index.scss';
import NFT from "@/images/head_NFT.png";
const NFTAvatar = ({avatarItem={},size="44px",onClick,NFTTagSize="23px"})=>{
  const {medium,nft_asset_id} = avatarItem
  return <div className='m-position-relative' onClick={onClick}>
    <Avatar src={medium} 
      alt="avatar"
      className='nft-avatar' 
      fit='cover'
      style={{'--size':size}}/>
    {/* show NFT tag */}
    {!!nft_asset_id&&<img src={NFT} alt="" className="nft-tag" style={{'--size':NFTTagSize,'--avatatSize':size}} />}
  </div>
}
export default NFTAvatar