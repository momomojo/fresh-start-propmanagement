import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tenant } from '../../../types';
import { ActionStatus } from '../types';
import { handleFirebaseError } from '@/lib/services/errorHandling';

interface TenantState {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  status: ActionStatus;
  error: string | null;
  filters: {
    status: string[];
    propertyId: string | null;
    search: string;
  };
}

const initialState: TenantState = {
  tenants: [],
  selectedTenant: null,
  status: ActionStatus.IDLE,
  error: null,
  filters: {
    status: [],
    propertyId: null,
    search: '',
  },
};

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    setTenants: (state, action: PayloadAction<Tenant[]>) => {
      state.tenants = action.payload;
      state.status = ActionStatus.SUCCEEDED;
      state.error = null;
    },
    setSelectedTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.selectedTenant = action.payload;
    },
    addTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenants.push(action.payload);
      state.status = ActionStatus.SUCCEEDED;
      state.error = null;
    },
    updateTenant: (state, action: PayloadAction<Tenant>) => {
      const index = state.tenants.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tenants[index] = action.payload;
      }
      state.status = ActionStatus.SUCCEEDED;
      state.error = null;
    },
    deleteTenant: (state, action: PayloadAction<string>) => {
      state.tenants = state.tenants.filter(t => t.id !== action.payload);
      state.status = ActionStatus.SUCCEEDED;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? ActionStatus.LOADING : ActionStatus.IDLE;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = ActionStatus.FAILED;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<TenantState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setTenants,
  setSelectedTenant,
  addTenant,
  updateTenant,
  deleteTenant,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = tenantSlice.actions;

export default tenantSlice.reducer;