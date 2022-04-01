import { setUserSetting } from "@/actions/user";
import { follow, unfollow } from "@/api/fans";
import { likeStatus, unLikeStatus } from "@/api/status";
import { store } from "@/stores";
import { useSelector } from "react-redux";
import { Toast } from "zarm";

/*
 * @Author: lmk
 * @Date: 2021-07-23 14:45:43
 * @LastEditTime: 2022-03-31 18:18:52
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
    Toast.show('like error')
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
export async function followed(item={}){
  const val = item.user || item;
  const fetchFn = val.is_followed ? unfollow : follow;
  try {
    await window.mises.isActive();
    console.log('followed')
    val.is_followed ? window.mises.userUnFollow(val.misesid) : window.mises.userFollow(val.misesid);
    await fetchFn({to_user_id:val.uid})
    val.is_followed = !val.is_followed;
    store.dispatch(setUserSetting({
      uid:val.uid,
      actionType: val.is_followed ? 'following' : 'follow'
    }))
  } catch (error) {
    console.log(error)
    // Toast.show(error||'follow error')
    return Promise.reject(error)
  }
}

export function useLogin(){
  const user = useSelector(state => state.user) || {};
  const isLogin = !!user.token;
  return {isLogin}
}