import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MaintenanceRequest } from '../../../types';

interface MaintenanceState {
  requests: MaintenanceRequest[];
  selectedRequest: MaintenanceRequest | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
    priority: string[];
    propertyId: string | null;
    search: string;
  };
}

const initialState: MaintenanceState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null,
  filters: {
    status: [],
    priority: [],
    propertyId: null,
    search: '',
  },
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<MaintenanceRequest[]>) => {
      state.requests = action.payload;
    },
    setSelectedRequest: (state, action: PayloadAction<MaintenanceRequest | null>) => {
      state.selectedRequest = action.payload;
    },
    addRequest: (state, action: PayloadAction<MaintenanceRequest>) => {
      state.requests.push(action.payload);
    },
    updateRequest: (state, action: PayloadAction<MaintenanceRequest>) => {
      const index = state.requests.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
    },
    deleteRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MaintenanceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setRequests,
  setSelectedRequest,
  addRequest,
  updateRequest,
  deleteRequest,
  setLoading,
  setError,
  setFilters,
} = maintenanceSlice.actions;

export default maintenanceSlice.reducer;