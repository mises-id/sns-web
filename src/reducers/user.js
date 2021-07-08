import {REHYDRATE} from 'redux-persist';

const initialState = {
  loginForm:{}
};
const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      console.log(action.payload)
      if (action.payload && action.payload.user) {
        return {...state, ...action.payload.user};
      }
      return state;
    case 'SET_USER_LOGIN': //设置用户信息
      return {
        ...state,
        loginForm: action.data,
      };
    case 'SET_USER_LOCATION': //设置用户位置
      return {
        ...state,
        location: action.data,
      };
    default:
      return state;
  }
}
export default userReducers