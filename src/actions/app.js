/*
 * @Author: lmk
 * @Date: 2021-07-21 22:14:52
 * @LastEditTime: 2022-09-27 11:53:32
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
// visibility flag
export function setReportVisibility(data){
  return {
    type: 'SET_REPORT_VISIVILITY',
    data
  };
}

export function setReportTargetId(data){
  return {
    type: 'SET_REPORT_TARGET_ID',
    data
  };
}