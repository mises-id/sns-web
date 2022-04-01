/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:09
 * @LastEditTime: 2022-04-01 14:56:15
 * @LastEditors: lmk
 * @Description: 
 */
import {REHYDRATE} from 'redux-persist';
const initialState = {
  visible:false,
  resetPageDataFlag:false
};
const appReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return state;
    case 'SET_VISIVILITY': //Set user information
      return {
        ...state,
        visible: action.data,
      };
    case 'SET_PAGE_DATA_FLAG': //reset page data
      return {
        ...state,
        resetPageDataFlag: action.data,
      };
      
    default:
      return state;
  }
}
export default appReducers