import { combineReducers } from "redux";
import appReducers from "./app";
import userReducers from "./user";
const rootReducer = combineReducers({
  user:userReducers,
  app:appReducers
});

export default rootReducer;