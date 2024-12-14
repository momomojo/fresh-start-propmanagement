import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertyService } from '../../services/propertyService';
import type { Property } from '../../../types';
import { ActionStatus } from '../types';

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
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, data }: { id: string; data: Partial<Property> }, { rejectWithValue }) => {
    try {
      return await propertyService.updateProperty(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
      return rejectWithValue((error as Error).message);
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.status = ActionStatus.LOADING;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.status = ActionStatus.SUCCEEDED;
      state.properties = action.payload;
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.status = ActionStatus.FAILED;
      state.error = action.payload as string;
    });

    // Create property
    builder.addCase(createProperty.fulfilled, (state, action) => {
      state.properties.push(action.payload);
    });

    // Update property
    builder.addCase(updateProperty.fulfilled, (state, action) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    });

    // Delete property
    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      state.properties = state.properties.filter(p => p.id !== action.payload);
    });
  },
});

export const { setSelectedProperty, clearError } = propertySlice.actions;

export default propertySlice.reducer;