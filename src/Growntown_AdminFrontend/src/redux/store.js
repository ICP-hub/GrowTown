// store.js or index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import infoReducer from './infoSlice'
import universalSearchReducer from "./universalSearchSlice"

// Load the preloaded state from local storage
const preloadedState = {
  auth: { isAuthenticated: false, user: null },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    info:infoReducer,
    universalSearch: universalSearchReducer
  },
  preloadedState,
});

export default store;
