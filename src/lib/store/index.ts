import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { errorMiddleware } from './middleware/errorMiddleware';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import tenantReducer from './slices/tenantSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    ui: uiReducer,
    tenants: tenantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType, RootState, unknown, Action<string>
>;