/*
 * @Author: lmk
 * @Date: 2021-07-21 22:14:52
 * @LastEditTime: 2022-04-01 14:51:59
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
// reset Page the Data
export function resetPageData(data){
  return {
    type: 'SET_PAGE_DATA_FLAG',
    data
  };
}