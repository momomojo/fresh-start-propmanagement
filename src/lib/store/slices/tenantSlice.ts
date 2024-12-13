import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tenant } from '../../../types';

interface TenantState {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  loading: boolean;
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
  loading: false,
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
    },
    setSelectedTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.selectedTenant = action.payload;
    },
    addTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenants.push(action.payload);
    },
    updateTenant: (state, action: PayloadAction<Tenant>) => {
      const index = state.tenants.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tenants[index] = action.payload;
      }
    },
    deleteTenant: (state, action: PayloadAction<string>) => {
      state.tenants = state.tenants.filter(t => t.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TenantState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
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
} = tenantSlice.actions;

export default tenantSlice.reducer;