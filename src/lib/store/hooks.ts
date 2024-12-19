import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Reusable hooks for common selectors
export const useAuth = () => useAppSelector((state) => state.auth);
export const useProperties = () => useAppSelector((state) => state.properties);
export const useUnits = () => useAppSelector((state) => state.units);
export const useTenants = () => useAppSelector((state) => state.tenants);
export const useUI = () => useAppSelector((state) => state.ui);