// src/lib/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionStatus } from '../types';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  status: ActionStatus;
  token: string | null;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  status: ActionStatus.IDLE,
  token: null,
  error: null,
  isInitialized: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = ActionStatus.SUCCEEDED;
      state.error = null;
      state.isInitialized = true;
    },
    setStatus: (state, action: PayloadAction<ActionStatus>) => {
      state.status = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = ActionStatus.FAILED;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = ActionStatus.IDLE;
      state.error = null;
      state.isInitialized = true;
    },
  },
});

export const { setUser, setStatus, setError, setToken, logout } = authSlice.actions;
export default authSlice.reducer;