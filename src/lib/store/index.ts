import { configureStore, ThunkAction, Action, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { errorMiddleware } from './middleware/errorMiddleware';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import tenantReducer from './slices/tenantSlice';
import unitReducer from './slices/unitSlice';
import maintenanceReducer from './slices/maintenanceSlice';

// Define the reducer type first
type Reducers = {
  auth: ReturnType<typeof authReducer>;
  properties: ReturnType<typeof propertyReducer>;
  ui: ReturnType<typeof uiReducer>;
  tenants: ReturnType<typeof tenantReducer>;
  units: ReturnType<typeof unitReducer>;
  maintenance: ReturnType<typeof maintenanceReducer>;
};

// Create the store configuration
const storeConfig = {
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    ui: uiReducer,
    tenants: tenantReducer,
    units: unitReducer,
    maintenance: maintenanceReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware as Middleware),
};

// Create and type the store
const store = configureStore<Reducers>(storeConfig);

// Export store
export { store };

// Export types
export type AppDispatch = typeof store.dispatch;
// Explicitly define RootState without circular reference
export type RootState = {
  auth: ReturnType<typeof authReducer>;
  properties: ReturnType<typeof propertyReducer>;
  ui: ReturnType<typeof uiReducer>;
  tenants: ReturnType<typeof tenantReducer>;
  units: ReturnType<typeof unitReducer>;
};

// Define reusable type for thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
