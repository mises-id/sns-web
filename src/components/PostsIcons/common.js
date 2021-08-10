import { follow, unfollow } from "@/api/fans";
import { likeStatus, unLikeStatus } from "@/api/status";
import { useSelector } from "react-redux";

/*
 * @Author: lmk
 * @Date: 2021-07-23 14:45:43
 * @LastEditTime: 2021-08-10 14:28:51
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
  const fn = val.is_liked ? likeStatus : unLikeStatus;
  try {
    await fn(val.id)
  } catch (error) {
    val.liked = !val.liked;
  }
}
/**
 * @description: follow and unfollow common
 * @param {*} e element event
 * @param {*} val current item data
 * @return {*} Promise
 */
export function followed(val){
  const fn = val.followed ? unfollow : follow;
  val.followed = !val.followed;
  return fn({to_user_id:val.id}).catch(res=>{
    val.followed = !val.followed;
  })
}
/**
* @param {*} 
*/
export function useLogin(){
  const user = useSelector(state => state.user);
  const isLogin = !!user.token;
  return {isLogin}
}