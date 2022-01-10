/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:09
 * @LastEditTime: 2022-01-06 13:39:08
 * @LastEditors: lmk
 * @Description: 
 */
import {REHYDRATE} from 'redux-persist';

const initialState = {
  loginForm:{},
  auth:'',
  token:'',
  badge:{
    total:0,
    notifications_count:0
  }
};
const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.user) {
        return {...state, ...action.payload.user};
      }
      return state;
    case 'SET_USER_LOGIN': //Set user information
      return {
        ...state,
        loginForm: action.data,
      };
    case 'SET_USER_AUTH': //Set user permissions
      return {
        ...state,
        auth: action.data,
      };  
    case 'SET_USER_TOKEN': //Set user token
      return {
        ...state,
        token: action.data,
      };  
    case 'SET_FOLLOWING_BADGE': //Set user corner mark
      return {
        ...state,
        badge: action.data,
      };
    default:
      return state;
  }
}
export default userReducers