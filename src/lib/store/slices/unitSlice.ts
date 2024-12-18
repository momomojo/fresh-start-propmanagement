import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { unitService } from '../../services/unitService';
import type { PropertyUnit } from '../../../types';
import { ActionStatus } from '../types';

interface UnitState {
  units: PropertyUnit[];
  selectedUnit: PropertyUnit | null;
  status: ActionStatus;
  error: string | null;
}

const initialState: UnitState = {
  units: [],
  selectedUnit: null,
  status: ActionStatus.IDLE,
  error: null,
};

// Async thunks
export const fetchUnits = createAsyncThunk(
  'units/fetchUnits',
  async (_, { rejectWithValue }) => {
    try {
      return await unitService.getUnits();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPropertyUnits = createAsyncThunk(
  'units/fetchPropertyUnits',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      return await unitService.getPropertyUnits(propertyId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createUnit = createAsyncThunk(
  'units/createUnit',
  async (data: Omit<PropertyUnit, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      return await unitService.createUnit(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
      return rejectWithValue((error as Error).message);
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
      return rejectWithValue((error as Error).message);
    }
  }
);

const unitSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    setSelectedUnit: (state, action: PayloadAction<PropertyUnit | null>) => {
      state.selectedUnit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = ActionStatus.FAILED;
    },
  },
  extraReducers: (builder) => {
    // Fetch all units
    builder.addCase(fetchUnits.pending, (state) => {
      state.status = ActionStatus.LOADING;
      state.error = null;
    });
    builder.addCase(fetchUnits.fulfilled, (state, action) => {
      state.status = ActionStatus.SUCCEEDED;
      state.units = action.payload;
    });
    builder.addCase(fetchUnits.rejected, (state, action) => {
      state.status = ActionStatus.FAILED;
      state.error = action.payload as string;
    });

    // Fetch property units
    builder.addCase(fetchPropertyUnits.pending, (state) => {
      state.status = ActionStatus.LOADING;
      state.error = null;
    });
    builder.addCase(fetchPropertyUnits.fulfilled, (state, action) => {
      state.status = ActionStatus.SUCCEEDED;
      state.units = action.payload;
    });
    builder.addCase(fetchPropertyUnits.rejected, (state, action) => {
      state.status = ActionStatus.FAILED;
      state.error = action.payload as string;
    });

    // Create unit
    builder.addCase(createUnit.fulfilled, (state, action) => {
      state.units.push(action.payload);
    });

    // Update unit
    builder.addCase(updateUnit.fulfilled, (state, action) => {
      const index = state.units.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.units[index] = action.payload;
      }
    });

    // Delete unit
    builder.addCase(deleteUnit.fulfilled, (state, action) => {
      state.units = state.units.filter(u => u.id !== action.payload);
    });
  },
});

export const { setSelectedUnit, clearError, setError } = unitSlice.actions;

export default unitSlice.reducer;
