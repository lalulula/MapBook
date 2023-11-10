import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import userReducer from "../features/userSlice";

const reducers = combineReducers({
  user: userReducer,
});


const persistConfig = {
  key: 'root',
  //로컬스토리지를 사용할 것이기때문에 storage를 적어주었다
  storage,
  whitelist: ['user']
};


const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
});


export default store;