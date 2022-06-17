/*
 * @Author: lmk
 * @Date: 2021-07-21 21:45:39
 * @LastEditTime: 2022-06-16 17:19:48
 * @LastEditors: lmk
 * @Description: user request
 */

import request from "@/utils/request"
/**
* @param {*} get user self info
*/
export function getUserSelfInfo(params){
  return request({
    params,
    url:'/user/me'
  })
}
/**
* @param {*} login
*/
export function signin(data){
  return request({
    data,
    url:'/signin',
    method:'post',
  })
}
/**
* @param {*} User update profile
*/
export function updateUser(data){
  return request({
    data,
    url:'/user/me',
    method:'patch',
  })
}
/**
* @param {*} get user info
*/
export function getUserInfo(uid){
  return request({
    url:`/user/${uid}`
  })
}
/**
 * @description: Join the blacklist
 * @param {Object} {uid:String}
 * @return {*}
 */
export function JoinBlackList(data){
  return request({
    data,
    url:'/user/blacklist',
    method:'post',
  })
}
/**
 * @description: remove the blacklist
 * @param {*}
 * @return {*}
 */
export function removeBlackList(uid){
  return request({
    url:`/user/blacklist/${uid}`,
    method:'delete',
  })
}
/**
 * @description: Get blacklist
 * @param {*}
 * @return {*}
 */
export function getBlackList(){
  return request({
    url:'/user/blacklist',
  })
}

export function getTwitterAuth(){
  return request({
    url:'/twitter/auth_url'
  })
}
export function getAirdropInfo(){
  return request({
    url:'/airdrop/info'
  })
}
export function getAirdropReceive(data){
  return request({
    url:'/airdrop/receive',
    data,
    method:"post"
  })
}
export async function getReferralUrl (params){
  return request({
    url: '/channel/info',
    method: 'get',
    params
  })
}

/**
 * @description: Get NFT list of users
 * @param {*} params
 * @return {*}
 */
export async function getUserDetailNFTAsset (params){
  return request({
    url: `/user/${params.uid}/nft_asset`,
    params
  })
}
/**
 * @description: get nft list
 * @param {*} params
 * @return {*}
 */
export async function getNFTAsset(params){
  return request({
    url: `/user/${params.uid}/nft_asset`,
    params
  })
}
/**
 * @description: get nft detail
 * @param {*} id
 * @return {*}
 */
export async function getNFTDetail(id){
  return request({
    url: `/nft_asset/${id}`
  })
}
/**
 * @description: like nft
 * @param {*} id
 * @return {*}
 */
export async function likeNFT(id){
  return request({
    url: `/nft_asset/${id}/like`,
    method:'post'
  })
}
/**
 * @description: unlike nft
 * @param {*} id
 * @return {*}
 */
export async function unlikeNFT(id){
  return request({
    url: `/nft_asset/${id}/like`,
    method:'delete'
  })
}

/**
 * @description: activity nft
 * @param {*} id
 * @return {*}
 */
 export async function NFTEvent(params){
  return request({
    url: `/nft_asset/${params.id}/event`,
    params
  })
}

/**
 * @description: activity nft
 * @param {*} id
 * @return {*}
 */
 export async function NFTLikeList(params){
  return request({
    url: `/nft_asset/${params.id}/like`,
    params
  })
}
/**
 * @description: activity nft
 * @param {*} id
 * @return {*}
 */
 export async function getMyNFTAsset(params){
  return request({
    url: `/user/nft_asset`,
    params
  })
}

 export async function getOpenseaNFTAsset(ethAddress){
  return request({
    url: `/opensea/assets`,
    params:{
      owner: ethAddress,
      cursor:'',
      limit:50
    }
  })
}
