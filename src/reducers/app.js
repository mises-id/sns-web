/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:09
 * @LastEditTime: 2022-02-10 18:12:54
 * @LastEditors: lmk
 * @Description: 
 */
import {REHYDRATE} from 'redux-persist';
const initialState = {
  visible:false
};
const appReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.user) {
        action.payload.user.web3Status = false;
        action.payload.user.web3ProviderFlag = true;
        return {...state, ...action.payload.user};
      }
      return state;
    case 'SET_VISIVILITY': //Set user information
      return {
        ...state,
        visible: action.data,
      };
    default:
      return state;
  }
}
export default appReducers