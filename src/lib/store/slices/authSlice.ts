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
  isAuthenticated: boolean;
  persistedAuth: null;
}

const initialState: AuthState = {
  user: null,
  status: ActionStatus.IDLE,
  token: null,
  error: null,
  isInitialized: false,
  isAuthenticated: false,
  persistedAuth: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = ActionStatus.SUCCEEDED;
      state.isAuthenticated = true;
      state.error = null;
      state.isInitialized = true;
      // Persist auth state
      localStorage.setItem('auth_state', JSON.stringify({
        user: action.payload,
        isAuthenticated: true
      }));
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
    restoreAuth: (state) => {
      const persisted = localStorage.getItem('auth_state');
      if (persisted) {
        const { user, isAuthenticated } = JSON.parse(persisted);
        state.user = user;
        state.isAuthenticated = isAuthenticated;
        state.status = ActionStatus.SUCCEEDED;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = ActionStatus.IDLE;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitialized = true;
      localStorage.removeItem('auth_state');
    },
  },
});

export const { setUser, setStatus, setError, setToken, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;