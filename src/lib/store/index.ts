import { configureStore, ThunkAction, Action, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { firestoreMiddleware } from './middleware/firestoreMiddleware';
import { db, auth, storage } from '../firebase/config';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import tenantReducer from './slices/tenantSlice';
import unitReducer from './slices/unitSlice';
import maintenanceReducer from './slices/maintenanceSlice';

type Reducers = {
  auth: ReturnType<typeof authReducer>;
  properties: ReturnType<typeof propertyReducer>;
  ui: ReturnType<typeof uiReducer>;
  tenants: ReturnType<typeof tenantReducer>;
  units: ReturnType<typeof unitReducer>;
  maintenance: ReturnType<typeof maintenanceReducer>;
};

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
      thunk: {
        extraArgument: { db, auth, storage }
      }
    }).concat(firestoreMiddleware as Middleware),
};

const store = configureStore<Reducers>(storeConfig);

export { store };

export type AppDispatch = typeof store.dispatch;
export type RootState = {
  auth: ReturnType<typeof authReducer>;
  properties: ReturnType<typeof propertyReducer>;
  ui: ReturnType<typeof uiReducer>;
  tenants: ReturnType<typeof tenantReducer>;
  units: ReturnType<typeof unitReducer>;
  maintenance: ReturnType<typeof maintenanceReducer>;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;