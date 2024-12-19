import { RootState } from '../index';

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

// Property selectors
export const selectProperties = (state: RootState) => state.properties.properties;
export const selectSelectedProperty = (state: RootState) => state.properties.selectedProperty;
export const selectPropertyStatus = (state: RootState) => state.properties.status;
export const selectPropertyError = (state: RootState) => state.properties.error;
export const selectPropertyFilters = (state: RootState) => state.properties.filters;

// Tenant selectors
export const selectTenants = (state: RootState) => state.tenants.tenants;
export const selectSelectedTenant = (state: RootState) => state.tenants.selectedTenant;
export const selectTenantStatus = (state: RootState) => state.tenants.status;
export const selectTenantError = (state: RootState) => state.tenants.error;
export const selectTenantFilters = (state: RootState) => state.tenants.filters;

// Unit selectors
export const selectUnits = (state: RootState) => state.units.units;
export const selectSelectedUnit = (state: RootState) => state.units.selectedUnit;
export const selectUnitStatus = (state: RootState) => state.units.status;
export const selectUnitError = (state: RootState) => state.units.error;
export const selectUnitFilters = (state: RootState) => state.units.filters;

// UI selectors
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectUIError = (state: RootState) => state.ui.error;