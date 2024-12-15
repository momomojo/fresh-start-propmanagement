import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UnitDetailsModal from '../UnitDetailsModal';
import unitReducer from '../../../lib/store/slices/unitSlice';
import { unitService } from '../../../lib/services/unitService';

// Mock the unitService
jest.mock('../../../lib/services/unitService', () => ({
  unitService: {
    updateUnit: jest.fn().mockResolvedValue({
      id: 'test-unit-1',
      property_id: 'test-property-1',
      unit_number: '102',
      floor_plan: '3BR/2BA',
      status: 'available',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }),
    deleteUnit: jest.fn().mockResolvedValue(true),
  },
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      units: unitReducer,
    },
  });
};

describe('UnitDetailsModal Component', () => {
  const mockUnit = {
    id: 'test-unit-1',
    property_id: 'test-property-1',
    unit_number: '101',
    floor_plan: '2BR/2BA',
    status: 'available' as const,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  const mockProps = {
    unit: mockUnit,
    onClose: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders unit details correctly', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UnitDetailsModal {...mockProps} />
      </Provider>
    );

    // Check if unit details are displayed
    expect(screen.getByTestId('unit-number-input')).toHaveValue('101');
    expect(screen.getByTestId('floor-plan-input')).toHaveValue('2BR/2BA');
    expect(screen.getByTestId('status-select')).toHaveValue('available');
  });

  test('enables editing mode', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UnitDetailsModal {...mockProps} />
      </Provider>
    );

    // Initially fields should be disabled
    expect(screen.getByTestId('unit-number-input')).toBeDisabled();

    // Click edit button
    fireEvent.click(screen.getByTestId('edit-button'));

    // Fields should now be enabled
    expect(screen.getByTestId('unit-number-input')).not.toBeDisabled();
  });

  test('handles form updates', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UnitDetailsModal {...mockProps} />
      </Provider>
    );

    // Enter edit mode
    fireEvent.click(screen.getByTestId('edit-button'));

    // Update fields
    fireEvent.change(screen.getByTestId('unit-number-input'), {
      target: { value: '102' },
    });
    fireEvent.change(screen.getByTestId('floor-plan-input'), {
      target: { value: '3BR/2BA' },
    });

    // Save changes
    fireEvent.click(screen.getByTestId('save-button'));

    // Wait for the service call and callback
    await waitFor(() => {
      expect(unitService.updateUnit).toHaveBeenCalled();
      expect(mockProps.onUpdate).toHaveBeenCalled();
    });
  });

  test('handles delete confirmation', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UnitDetailsModal {...mockProps} />
      </Provider>
    );

    // Enter edit mode
    fireEvent.click(screen.getByTestId('edit-button'));

    // Click delete button
    fireEvent.click(screen.getByTestId('delete-button'));

    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    // Wait for the service call and callback
    await waitFor(() => {
      expect(unitService.deleteUnit).toHaveBeenCalled();
      expect(mockProps.onDelete).toHaveBeenCalled();
    });
  });

  test('handles close button click', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <UnitDetailsModal {...mockProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
