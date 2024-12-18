import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkConnection } from '@/lib/utils/network';
import { ActionStatus } from '../types';
import type { User } from '../../../types';

interface AuthState {
  user: User | null;
  status: ActionStatus;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  status: ActionStatus.IDLE,
  error: null,
  isInitialized: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
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
    logout: (state) => {
      state.user = null;
      state.status = ActionStatus.IDLE;
      state.error = null;
      state.isInitialized = true;
    },
  },
});

export const { setUser, setStatus, setError, logout } = authSlice.actions;
export default authSlice.reducer;