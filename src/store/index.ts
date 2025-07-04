import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import auth from './auth';
import staking from './staking';
import adminData from "./admin";

const rootReducer = combineReducers({
  auth,
  staking,
  adminData
  // Add other reducers here as needed
});

export const store = configureStore({
  reducer: {
    auth,
    staking,
    adminData
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default rootReducer; 