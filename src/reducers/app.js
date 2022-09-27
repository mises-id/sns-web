/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:09
 * @LastEditTime: 2022-09-27 12:02:07
 * @LastEditors: lmk
 * @Description: 
 */
import {REHYDRATE} from 'redux-persist';
const initialState = {
  visible:false,
  resetPageDataFlag:false,
  reportVisible: false,
  target_id: ''
};
const appReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.target_id) {
        action.payload.target_id = '';
      }
      if (action.payload && action.payload.reportVisible) {
        action.payload.reportVisible = false;
      }
    return {...state,...action.payload};
    case 'SET_VISIVILITY': //Set user information
      return {
        ...state,
        visible: action.data,
      };
    case 'SET_REPORT_VISIVILITY': //Set user information
      return {
        ...state,
        reportVisible: action.data,
      };
    case 'SET_PAGE_DATA_FLAG': //reset page data
      return {
        ...state,
        resetPageDataFlag: action.data,
      };
    case 'SET_REPORT_TARGET_ID': //set report target ID
      return {
        ...state,
        target_id: action.data,
      };
      
    default:
      return state;
  }
}
export default appReducers