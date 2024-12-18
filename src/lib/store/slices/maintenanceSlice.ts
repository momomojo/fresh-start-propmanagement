import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { maintenanceService } from '../../firebase/services/maintenanceService';
import type { MaintenanceRequest } from '../../../types';
import { ActionStatus } from '../types';

interface MaintenanceState {
  requests: MaintenanceRequest[];
  selectedRequest: MaintenanceRequest | null;
  status: ActionStatus;
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
  status: ActionStatus.IDLE,
  error: null,
  filters: {
    status: [],
    priority: [],
    propertyId: null,
    search: '',
  },
};

export const fetchMaintenanceRequests = createAsyncThunk(
  'maintenance/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await maintenanceService.getRequests();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenanceRequests.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchMaintenanceRequests.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.requests = action.payload;
      })
      .addCase(fetchMaintenanceRequests.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      });
  }
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