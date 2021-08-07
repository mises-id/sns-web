import { follow, unfollow } from "@/api/fans";
import { likeStatus } from "@/api/status";

/*
 * @Author: lmk
 * @Date: 2021-07-23 14:45:43
 * @LastEditTime: 2021-07-23 15:22:23
 * @LastEditors: lmk
 * @Description: postsIcon function
 */
/**
 * @description: like common
 * @param {*} e element event
 * @param {*} val current item data
 * @return {*} Promise
 */
export function liked(e,val){
  e.stopPropagation()
  val.liked = !val.liked;
  return likeStatus(val.id).catch(res=>{
    val.liked = !val.liked;
  })
}
/**
 * @description: follow and unfollow common
 * @param {*} e element event
 * @param {*} val current item data
 * @return {*} Promise
 */
export function followed(e,val){
  e.stopPropagation()
  const fn = val.followed ? unfollow : follow;
  return fn(val.id).catch(res=>{
    val.followed = !val.followed;
  })
}