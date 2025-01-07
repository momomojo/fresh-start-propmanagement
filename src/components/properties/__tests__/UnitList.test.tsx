import { render, screen, fireEvent } from '@testing-library/react';
import { UnitList } from '../UnitList';
import { PropertyUnit, Tenant } from '@/types';

describe('UnitList', () => {
  const mockUnits: (PropertyUnit & { tenant?: Tenant })[] = [
    {
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
    },
    {
      id: '2',
      property_id: 'prop1',
      unit_number: 'B1',
      floor_plan: '1BR',
      status: 'occupied',
      rent_amount: 1500,
      square_feet: 750,
      bedrooms: 1,
      bathrooms: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      tenant: {
        id: 'tenant1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        unit_id: '2',
        lease_start: '2024-01-01',
        lease_end: '2024-12-31',
        rent_amount: 1500,
        security_deposit: 1500,
        status: 'active',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    },
  ];

  const mockOnUnitClick = jest.fn();

  beforeEach(() => {
    mockOnUnitClick.mockClear();
  });

  it('renders all units', () => {
    render(<UnitList units={mockUnits} onUnitClick={mockOnUnitClick} />);

    expect(screen.getByText('Unit A1')).toBeInTheDocument();
    expect(screen.getByText('Unit B1')).toBeInTheDocument();
  });

  it('displays tenant information when available', () => {
    render(<UnitList units={mockUnits} onUnitClick={mockOnUnitClick} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onUnitClick when a unit is clicked', () => {
    render(<UnitList units={mockUnits} onUnitClick={mockOnUnitClick} />);

    fireEvent.click(screen.getByText('Unit A1'));
    expect(mockOnUnitClick).toHaveBeenCalledWith(mockUnits[0]);
  });

  it('calls onUnitClick when View Details button is clicked', () => {
    render(<UnitList units={mockUnits} onUnitClick={mockOnUnitClick} />);

    const buttons = screen.getAllByText('View Details');
    fireEvent.click(buttons[0]);
    expect(mockOnUnitClick).toHaveBeenCalledWith(mockUnits[0]);
  });
});
