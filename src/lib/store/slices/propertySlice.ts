import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertyService } from '../../services/propertyService';
import type { Property } from '../../../types';
import { ActionStatusEnum, type ActionStatus } from '../types';

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  status: ActionStatus;
  error: string | null;
  filters: {
    status: Property['status'][];
    type: Property['type'][];
    search: string;
  };
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  status: ActionStatusEnum.IDLE,
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
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
      state.status = ActionStatusEnum.SUCCEEDED;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.status = ActionStatusEnum.LOADING;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.status = ActionStatusEnum.SUCCEEDED;
      state.properties = action.payload;
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.status = ActionStatusEnum.FAILED;
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

export const { setProperties, setSelectedProperty, setFilters, clearError } = propertySlice.actions;

export default propertySlice.reducer;