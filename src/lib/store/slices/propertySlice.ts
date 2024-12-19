import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertyService } from '../../services/propertyService';
import type { Property } from '../../../types';
import { ActionStatus } from '../types';
import { handleFirebaseError } from '@/lib/services/errorHandling';

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  status: ActionStatus;
  error: string | null;
  filters: {
    status: string[];
    type: string[];
    search: string;
  };
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  status: ActionStatus.IDLE,
  error: null,
  filters: {
    status: [],
    type: [],
    search: '',
  },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      return await propertyService.getProperties();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      return await propertyService.createProperty(data);
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, data }: { id: string; data: Partial<Property> }, { rejectWithValue }) => {
    try {
      const updatedProperty = await propertyService.updateProperty(id, data);
      if (!updatedProperty) {
        throw new Error('Property not found');
      }
      return updatedProperty;
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (id: string, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      const appError = handleFirebaseError(error);
      return rejectWithValue(appError.message);
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
      state.status = ActionStatus.SUCCEEDED;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = ActionStatus.FAILED;
    },
    setFilters: (state, action: PayloadAction<Partial<PropertyState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Create property cases
      .addCase(createProperty.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.properties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Update property cases
      .addCase(updateProperty.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        const index = state.properties.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      })
      // Delete property cases
      .addCase(deleteProperty.pending, (state) => {
        state.status = ActionStatus.LOADING;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.status = ActionStatus.SUCCEEDED;
        state.properties = state.properties.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.status = ActionStatus.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProperties,
  setSelectedProperty,
  clearError,
  setError,
  setFilters,
} = propertySlice.actions;

export default propertySlice.reducer;