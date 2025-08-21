# Redux Slice Structure Implementation Guide

## Overview
This document provides a simplified guide for implementing the Redux slice structure used in the GreenDash project. The structure follows Redux Toolkit best practices with clean TypeScript interfaces.

## Project Structure
```
src/
├── store/
│   ├── index.ts          # Store configuration
│   ├── auth.ts           # Authentication slice
│   └── admin.ts          # Admin data slice
└── types/
    ├── auth.ts           # Auth-related interfaces
    ├── progress.ts        # Progress interfaces
    └── admin.ts          # Admin-related interfaces
```

## 1. Store Configuration (store/index.ts)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import adminDataReducer from './admin';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminData: adminDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 2. Essential TypeScript Interfaces

### Auth Types (types/auth.ts)
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  referral_code: string;
  is_admin: boolean;
  phone: string;
  wallet_address: string;
  egd_balance: number;
  withdrawals: number;
  referred_by: number;
  parent_leg: 'left' | 'right';
  left_volume: number;
  right_volume: number;
  rank_goal: number;
  benefit_overflow: boolean;
  created_at: string;
}

export interface UserBaseData {
  upline_users: UplineUserEntry[];
  referral_network: ReferralNode[];
  recent_stakings: Staking[];
  recent_transactions: Transaction[];
  recent_withdrawals: Withdrawal[];
}

export interface Staking {
  id: number;
  user_id: number;
  package_id: number;
  status: 'active' | 'completed' | "free_staking";
  createdAt: string;
  updatedAt: string;
  package: Package;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  stake_amount: string;
  daily_yield_percentage: number;
  lock_period_days: number;
  createdAt: string;
  updatedAt: string;
}
```

### Progress Types (types/progress.ts)
```typescript
export interface Staking_progress {
  progress_rate: number;
  current_earned: number;
  target_amount: number;
  current_staking_package_amount: number;
  has_active_staking: boolean;
  current_staking_package_name: string;
}
```

### Admin Types (types/admin.ts)
```typescript
export interface AdminSetting {
  id: number;
  title: string;
  value: string;
  description?: string;
}

export interface StakingPackage {
  id: number;
  name: string;
  description: string;
  stake_amount: string;
  daily_yield_percentage: number;
  lock_period_days: number;
}
```

## 3. Authentication Slice (store/auth.ts)

### State Interface
```typescript
interface AppState {
  token: string;
  user: User;
  user_base_data: UserBaseData;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: boolean;
  staking_progress: Staking_progress;
}
```

### Initial State
```typescript
const initialState: AppState = {
  user: {} as User,
  user_base_data: {} as UserBaseData,
  token: "",
  isAuthenticated: false,
  isLoading: false,
  error: false,
  staking_progress: {
    progress_rate: 0,
    current_earned: 0,
    target_amount: 0,
    current_staking_package_amount: 0,
    has_active_staking: false,
    current_staking_package_name: ""
  }
};
```

### Slice Definition
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserBaseData, Staking_progress } from '@/types/auth';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{
      token: string;
      user: User;
      user_base_data: UserBaseData;
      staking_progress: Staking_progress;
    }>) => {
      const { token, user, user_base_data, staking_progress } = action.payload;
      state.token = token;
      state.user_base_data = user_base_data;
      state.user = user;
      state.isAuthenticated = true;
      state.staking_progress = staking_progress;
    },
    logout: (state) => {
      state.token = "";
      state.user = {} as User;
      state.user_base_data = {} as UserBaseData;
      state.isAuthenticated = false;
      state.staking_progress = initialState.staking_progress;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
```

## 4. Admin Data Slice (store/admin.ts)

### State Interface
```typescript
interface AdminState {
  admin_settings: AdminSetting[];
  staking_packages: StakingPackage[];
  total_tokens: any[];
}
```

### Initial State
```typescript
const initialState: AdminState = {
  admin_settings: [],
  staking_packages: [],
  total_tokens: [],
};
```

### Slice Definition
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminSetting, StakingPackage } from '@/types/admin';

const adminSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    setAdminSettings: (state, action: PayloadAction<AdminSetting[]>) => {
      state.admin_settings = action.payload;
    },
    setStakingPackages: (state, action: PayloadAction<StakingPackage[]>) => {
      state.staking_packages = action.payload;
    },
  },
});

export const { setAdminSettings, setStakingPackages } = adminSlice.actions;
export default adminSlice.reducer;
```

## 5. One Example API Endpoint

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{
      success: boolean;
      message: string;
      user: User;
      user_base_data: UserBaseData;
      token: string;
      staking_progress: Staking_progress;
    }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
```

## 6. Usage Example in Component

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setUser, logout } from '@/store/auth';
import { setAdminSettings } from '@/store/admin';
import { useLoginMutation } from '@/store/auth';

const LoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, staking_progress } = useSelector((state: RootState) => state.auth);
  const { admin_settings } = useSelector((state: RootState) => state.adminData);
  
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setUser(result));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Staking Progress: {staking_progress.progress_rate}%</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      )}
    </div>
  );
};
```

## 7. Key Benefits

1. **Type Safety**: Full TypeScript support with proper interfaces
2. **Clean Structure**: Simple, focused slices for different domains
3. **Easy to Use**: Direct dispatch and selector usage
4. **Scalable**: Easy to add new slices and features
5. **Performance**: Optimized re-renders with proper selectors

## 8. Implementation Steps

1. Install: `npm install @reduxjs/toolkit react-redux`
2. Create the store structure as shown above
3. Define your interfaces and types
4. Create your slices with reducers
5. Set up one API endpoint as example
6. Wrap your app with Redux Provider
7. Use useSelector and useDispatch in components

This structure provides a clean foundation for building React applications with Redux Toolkit and TypeScript. 