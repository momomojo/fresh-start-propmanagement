import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddUnitModal from '../AddUnitModal';
import unitReducer from '../../../lib/store/slices/unitSlice';
import { unitService } from '../../../lib/services/unitService';

// Mock the unitService
jest.mock('../../../lib/services/unitService', () => ({
  unitService: {
    createUnit: jest.fn().mockResolvedValue({
      id: 'test-unit-1',
      property_id: 'test-property-1',
      unit_number: '101',
      floor_plan: '2BR/2BA',
      status: 'available',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }),
  },
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      units: unitReducer,
    },
  });
};

describe('AddUnitModal Component', () => {
  const mockProps = {
    propertyId: 'test-property-1',
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <AddUnitModal {...mockProps} />
      </Provider>
    );

    // Check if all form fields are rendered
    expect(screen.getByTestId('unit-number-input')).toBeInTheDocument();
    expect(screen.getByTestId('floor-plan-input')).toBeInTheDocument();
    expect(screen.getByTestId('status-select')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <AddUnitModal {...mockProps} />
      </Provider>
    );

    // Fill out the form
    fireEvent.change(screen.getByTestId('unit-number-input'), {
      target: { value: '101' },
    });
    fireEvent.change(screen.getByTestId('floor-plan-input'), {
      target: { value: '2BR/2BA' },
    });
    fireEvent.change(screen.getByTestId('status-select'), {
      target: { value: 'available' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Add Unit'));

    // Wait for the service call and callback
    await waitFor(() => {
      expect(unitService.createUnit).toHaveBeenCalled();
      expect(mockProps.onSuccess).toHaveBeenCalled();
    });
  });

  test('handles close button click', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <AddUnitModal {...mockProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
