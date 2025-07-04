import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import auth from './auth';
import adminData from "./admin";

const rootReducer = combineReducers({
  auth,
  adminData
  // Add other reducers here as needed
});

export const store = configureStore({
  reducer: {
    auth,
    adminData
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default rootReducer; 