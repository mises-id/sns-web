/*
 * @Author: lmk
 * @Date: 2021-07-08 22:26:55
 * @LastEditTime: 2021-07-21 22:58:31
 * @LastEditors: lmk
 * @Description: 
 */
import {createStore} from 'redux';
import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from '@/reducers'
import {migrations, version} from '@/stores/migrations';
import Logger from '@/utils/Logger';
import storage from 'redux-persist/lib/storage'
const persistConfig = {
  key: 'root',
  version,
  storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  migrate: createMigrate(migrations, {debug: true}),
  writeFailHandler: error =>
    Logger.error(error, {message: 'Error persisting data'}), // Log error if saving state fails
};

const pReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(pReducer)
export const persistor = persistStore(store)