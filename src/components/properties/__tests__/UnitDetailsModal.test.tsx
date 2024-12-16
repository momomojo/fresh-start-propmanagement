import { render, screen, fireEvent } from '@testing-library/react';
import { UnitDetailsModal } from '../UnitDetailsModal';
import { PropertyUnit } from '@/types';

describe('UnitDetailsModal', () => {
  const mockUnit: PropertyUnit = {
    id: '1',
    property_id: 'prop1',
    unit_number: 'A1',
    floor_plan: 'Studio',
    status: 'vacant',
    rent_amount: 1000,
    square_feet: 500,
    bedrooms: 1,
    bathrooms: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  it('renders unit details', () => {
    render(
      <UnitDetailsModal
        unit={mockUnit}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('A1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Studio')).toBeInTheDocument();
    expect(screen.getByDisplayValue('vacant')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <UnitDetailsModal
        unit={mockUnit}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onSave with updated unit data when Save button is clicked', () => {
    render(
      <UnitDetailsModal
        unit={mockUnit}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const unitNumberInput = screen.getByLabelText('Unit Number');
    const floorPlanInput = screen.getByLabelText('Floor Plan');
    const statusSelect = screen.getByLabelText('Status');
    const rentAmountInput = screen.getByLabelText('Rent Amount');
    const squareFeetInput = screen.getByLabelText('Square Feet');
    const bedroomsInput = screen.getByLabelText('Bedrooms');
    const bathroomsInput = screen.getByLabelText('Bathrooms');

    fireEvent.change(unitNumberInput, { target: { value: 'B1' } });
    fireEvent.change(floorPlanInput, { target: { value: '1BR' } });
    fireEvent.change(statusSelect, { target: { value: 'occupied' } });
    fireEvent.change(rentAmountInput, { target: { value: '1500' } });
    fireEvent.change(squareFeetInput, { target: { value: '750' } });
    fireEvent.change(bedroomsInput, { target: { value: '1' } });
    fireEvent.change(bathroomsInput, { target: { value: '1' } });

    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockUnit,
      unit_number: 'B1',
      floor_plan: '1BR',
      status: 'occupied',
      rent_amount: 1500,
      square_feet: 750,
      bedrooms: 1,
      bathrooms: 1,
    });
  });

  it('validates required fields', () => {
    render(
      <UnitDetailsModal
        unit={mockUnit}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const unitNumberInput = screen.getByLabelText('Unit Number');
    fireEvent.change(unitNumberInput, { target: { value: '' } });

    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Unit number is required')).toBeInTheDocument();
  });

  it('validates rent amount is a positive number', () => {
    render(
      <UnitDetailsModal
        unit={mockUnit}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const rentAmountInput = screen.getByLabelText('Rent Amount');
    fireEvent.change(rentAmountInput, { target: { value: '-100' } });

    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Rent amount must be positive')).toBeInTheDocument();
  });
});
