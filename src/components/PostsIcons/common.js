import { follow, unfollow } from "@/api/fans";
import { likeStatus, unLikeStatus } from "@/api/status";
import { useSelector } from "react-redux";

/*
 * @Author: lmk
 * @Date: 2021-07-23 14:45:43
 * @LastEditTime: 2021-08-12 23:18:41
 * @LastEditors: lmk
 * @Description: postsIcon function
 */
/**
 * @description: like common
 * @param {*} e element event
 * @param {*} val current item data
 * @return {*} Promise
 */
export async function liked(val){
  val.is_liked = !val.is_liked;
  val.likes_count = val.is_liked ? val.likes_count+1 : val.likes_count-1;
  const fn = val.is_liked ? likeStatus : unLikeStatus;
  try {
    await fn(val.id);
  } catch (error) {
    val.liked = !val.liked;
    val.likes_count = val.is_liked ? val.likes_count+1 : val.likes_count-1;
  }
}
/**
 * @description: follow and unfollow common
 * @param {*} e element event
 * @param {*} val current item data
 * @return {*} Promise
 */
export function followed(item={}){
  const val = item.user;
  const fn = val.is_followed ? unfollow : follow;
  val.is_followed = !val.is_followed;
  return fn({to_user_id:val.uid}).catch(res=>{
    val.is_followed = !val.is_followed;
  })
}
/**
* @param {*} 
*/
export function useLogin(){
  const user = useSelector(state => state.user) || {};
  const isLogin = !!user.token;
  return {isLogin}
}