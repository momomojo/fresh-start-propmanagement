import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UnitList from '../UnitList';
import unitReducer from '../../../lib/store/slices/unitSlice';
import { ActionStatus } from '../../../lib/store/types';

// Mock the Redux dispatch
const mockDispatch = jest.fn(() => Promise.resolve());
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

// Mock the fetchPropertyUnits action
jest.mock('../../../lib/store/slices/unitSlice', () => ({
  ...jest.requireActual('../../../lib/store/slices/unitSlice'),
  __esModule: true,
  default: jest.requireActual('../../../lib/store/slices/unitSlice').default,
  fetchPropertyUnits: (propertyId: string) => ({ type: 'units/fetchPropertyUnits', payload: propertyId }),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      units: unitReducer,
    },
    preloadedState: {
      units: {
        units: [],
        selectedUnit: null,
        status: ActionStatus.IDLE,
        error: null,
        ...initialState,
      },
    },
  });
};

// Mock data
const mockUnits = [
  {
    id: '1',
    property_id: 'prop1',
    unit_number: '101',
    floor_plan: '2BR',
    status: 'available' as const,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    property_id: 'prop1',
    unit_number: '102',
    floor_plan: '1BR',
    status: 'occupied' as const,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('UnitList Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  test('renders loading state', () => {
    const store = createMockStore({
      status: ActionStatus.LOADING,
    });

    render(
      <Provider store={store}>
        <UnitList propertyId="prop1" />
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMessage = 'Failed to load units';
    const store = createMockStore({
      status: ActionStatus.FAILED,
      error: errorMessage,
    });

    render(
      <Provider store={store}>
        <UnitList propertyId="prop1" />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
  });

  test('renders units list', () => {
    const store = createMockStore({
      units: mockUnits,
      status: ActionStatus.SUCCEEDED,
    });

    render(
      <Provider store={store}>
        <UnitList propertyId="prop1" />
      </Provider>
    );

    expect(screen.getByTestId('unit-row-101')).toHaveTextContent('101');
    expect(screen.getByTestId('unit-row-102')).toHaveTextContent('102');
    expect(screen.getByText('2BR')).toBeInTheDocument();
    expect(screen.getByText('1BR')).toBeInTheDocument();
  });

  test('handles unit click', () => {
    const onUnitClick = jest.fn();
    const store = createMockStore({
      units: mockUnits,
      status: ActionStatus.SUCCEEDED,
    });

    render(
      <Provider store={store}>
        <UnitList propertyId="prop1" onUnitClick={onUnitClick} />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('unit-row-101'));
    expect(onUnitClick).toHaveBeenCalledWith(mockUnits[0]);
  });

  test('dispatches fetchPropertyUnits on mount', () => {
    const store = createMockStore();
    const propertyId = 'prop1';

    render(
      <Provider store={store}>
        <UnitList propertyId={propertyId} />
      </Provider>
    );

    const expectedAction = { type: 'units/fetchPropertyUnits', payload: propertyId };
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining(expectedAction));
  });
});
