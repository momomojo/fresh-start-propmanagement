import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UnitDetailsModal from '../UnitDetailsModal';
import { PropertyUnit } from '../../../types';

const mockStore = configureStore([]);

describe('UnitDetailsModal', () => {
  let store: any;
  const mockUnit: PropertyUnit = {
    id: 'test-unit-id',
    property_id: 'test-property-id',
    unit_number: '101',
    floor_plan: 'Studio', // Even though it's nullable, we provide a value for testing
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    store = mockStore({
      units: {
        status: 'idle',
        error: null
      }
    });
  });

  it('renders unit details', () => {
    render(
      <Provider store={store}>
        <UnitDetailsModal
          unit={mockUnit}
          onClose={() => {}}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    );

    // Check for unit number
    expect(screen.getByText(mockUnit.unit_number)).toBeInTheDocument();
    
    // Check for floor plan if it exists
    if (mockUnit.floor_plan) {
      expect(screen.getByText(mockUnit.floor_plan)).toBeInTheDocument();
    }
    
    // Check for status
    expect(screen.getByText(mockUnit.status, { exact: false })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Provider store={store}>
        <UnitDetailsModal
          unit={mockUnit}
          onClose={onClose}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    );

    // Find the close button by its aria-label
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(
      <Provider store={store}>
        <UnitDetailsModal
          unit={mockUnit}
          onClose={() => {}}
          onUpdate={() => {}}
          onDelete={onDelete}
        />
      </Provider>
    );

    // Find the delete button by its text content
    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it('calls onUpdate when update button is clicked', () => {
    const onUpdate = jest.fn();
    render(
      <Provider store={store}>
        <UnitDetailsModal
          unit={mockUnit}
          onClose={() => {}}
          onUpdate={onUpdate}
          onDelete={() => {}}
        />
      </Provider>
    );

    // Find the update button by its text content
    const updateButton = screen.getByText(/update/i);
    fireEvent.click(updateButton);
    expect(onUpdate).toHaveBeenCalled();
  });

  it('renders N/A for null floor plan', () => {
    const unitWithNullFloorPlan: PropertyUnit = {
      ...mockUnit,
      floor_plan: null
    };

    render(
      <Provider store={store}>
        <UnitDetailsModal
          unit={unitWithNullFloorPlan}
          onClose={() => {}}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      </Provider>
    );

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
