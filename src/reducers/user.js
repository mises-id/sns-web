/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:09
 * @LastEditTime: 2022-08-20 18:23:13
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
  },
  userActions:{
    actionType:"", // follow following 
    uid:'' // set user uid
  },
  web3Status:false,
  web3ProviderFlag:true,
  isFistLogin:false
};
const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.user) {
        action.payload.user.web3Status = false;
        action.payload.user.web3ProviderFlag = true;
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
    case 'SET_USER_SETTING': // Set user actions
      return {
        ...state,
        userActions: action.data,
      };
    case 'SET_WEB3_INIT': // Set web3 actions
      return {
        ...state,
        web3Status: action.data,
      };
      case 'SET_WEB3_PROVIDER_FLAG': // Set web3 provider actions
        return {
          ...state,
          web3ProviderFlag: action.data,
        };
      
      case 'SET_FIRST_LOGIN': // Set web3 account changed
        return {
          ...state,
          isFistLogin: action.data,
        };
    default:
      return state;
  }
}
export default userReducers