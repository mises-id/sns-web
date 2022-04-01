/*
 * @Author: lmk
 * @Date: 2021-07-21 22:14:52
 * @LastEditTime: 2022-03-07 14:48:15
 * @LastEditors: lmk
 * @Description: app actions
 */
// visibility flag
export function setVisibility(data){
  return {
    type: 'SET_VISIVILITY',
    data
  };
}