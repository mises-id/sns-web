/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:09
 * @LastEditTime: 2021-08-07 10:19:37
 * @LastEditors: lmk
 * @Description: 
 */
import {REHYDRATE} from 'redux-persist';

const initialState = {
  loginForm:{},
  auth:'',
  token:''
};
const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.user) {
        return {...state, ...action.payload.user};
      }
      return state;
    case 'SET_USER_LOGIN': //设置用户信息
      return {
        ...state,
        loginForm: action.data,
      };
    case 'SET_USER_AUTH': //设置用户权限
      return {
        ...state,
        auth: action.data,
      };  
    case 'SET_USER_TOKEN': //设置用户权限
      return {
        ...state,
        token: action.data,
      };  
    default:
      return state;
  }
}
export default userReducers