import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { unitService } from '@/lib/services/unitService';
import type { PropertyUnit } from '../../../types';
import { ActionStatus } from '../types';
import { handleFirebaseError } from '@/lib/services/errorHandling';

interface UnitState {
  units: PropertyUnit[];
  selectedUnit: PropertyUnit | null;
  status: ActionStatus;
  error: string | null;
  filters: {
    propertyId: string | null;
    status: string[];
    search: string;
  };
}

const initialState: UnitState = {
  units: [],
  selectedUnit: null,
  status: ActionStatus.IDLE,
  error: null,
  filters: {
    propertyId: null,
    status: [],
    search: '',
  },
};

// Async thunks
export const fetchUnits = createAsyncThunk(
  'units/fetchUnits',
  async (_, { rejectWithValue }) => {
    try {
      return await unitService.getUnits();
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const fetchPropertyUnits = createAsyncThunk(
  'units/fetchPropertyUnits',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      return await unitService.getPropertyUnits(propertyId);
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const createUnit = createAsyncThunk(
  'units/createUnit',
  async (data: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      return await unitService.createUnit(data);
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const updateUnit = createAsyncThunk(
  'units/updateUnit',
  async ({ id, data }: { id: string; data: Partial<PropertyUnit> }, { rejectWithValue }) => {
    try {
      const updatedUnit = await unitService.updateUnit(id, data);
      if (!updatedUnit) {
        throw new Error('Unit not found');
      }
      return updatedUnit;
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const deleteUnit = createAsyncThunk(
  'units/deleteUnit',
  async (id: string, { rejectWithValue }) => {
    try {
      await unitService.deleteUnit(id);
      return id;
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

const unitSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    setUnits: (state, action: PayloadAction<PropertyUnit[]>) => {
      state.units = action.payload;
      state.status = ActionStatus.SUCCEEDED;
    },
    setSelectedUnit: (state, action: PayloadAction<PropertyUnit | null>) => {
      state.selectedUnit = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? ActionStatus.LOADING : ActionStatus.IDLE;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = ActionStatus.FAILED;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<UnitState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch units
      .addCase(fetchUnits.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Fetch property units
      .addCase(fetchPropertyUnits.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchPropertyUnits.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.units = action.payload;
      })
      .addCase(fetchPropertyUnits.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Create unit
      .addCase(createUnit.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.units.push(action.payload);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Update unit
      .addCase(updateUnit.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        const index = state.units.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.units[index] = action.payload;
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Delete unit
      .addCase(deleteUnit.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.units = state.units.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUnits,
  setSelectedUnit,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = unitSlice.actions;

export default unitSlice.reducer;