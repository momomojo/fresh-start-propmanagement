import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { firestoreMiddleware } from './middleware/firestoreMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import tenantReducer from './slices/tenantSlice';
import unitReducer from './slices/unitSlice';
import maintenanceReducer from './slices/maintenanceSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  properties: propertyReducer,
  ui: uiReducer,
  tenants: tenantReducer,
  units: unitReducer,
  maintenance: maintenanceReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/FLUSH'
        ],
        ignoredPaths: ['register', '_persist', 'persistor'],
      },
    }).concat([firestoreMiddleware, authMiddleware, errorMiddleware]),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export * from './hooks';
export * from './selectors';