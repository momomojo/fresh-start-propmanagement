import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UnitList from '../UnitList';
import { PropertyUnit } from '../../../types';
import { ActionStatus } from '../../../lib/store/types';

const mockStore = configureStore([]);

describe('UnitList', () => {
  let store: any;
  const mockUnits: PropertyUnit[] = [
    {
      id: 'unit-1',
      property_id: 'property-1',
      unit_number: '101',
      floor_plan: 'Studio',
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'unit-2',
      property_id: 'property-1',
      unit_number: '102',
      floor_plan: '1 Bedroom',
      status: 'occupied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    store = mockStore({
      units: {
        units: mockUnits,
        status: ActionStatus.IDLE,
        error: null
      }
    });
  });

  it('renders loading spinner when loading', () => {
    store = mockStore({
      units: {
        units: [],
        status: ActionStatus.LOADING,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <UnitList propertyId="property-1" />
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const errorMessage = 'Failed to load units';
    store = mockStore({
      units: {
        units: [],
        status: ActionStatus.FAILED,
        error: errorMessage
      }
    });

    render(
      <Provider store={store}>
        <UnitList propertyId="property-1" />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
  });

  it('renders list of units', () => {
    render(
      <Provider store={store}>
        <UnitList propertyId="property-1" />
      </Provider>
    );

    mockUnits.forEach(unit => {
      expect(screen.getByText(unit.unit_number)).toBeInTheDocument();
      expect(screen.getByText(unit.floor_plan as string)).toBeInTheDocument();
      expect(screen.getByText(unit.status)).toBeInTheDocument();
    });
  });

  it('calls onUnitClick when a unit is clicked', () => {
    const onUnitClick = jest.fn();
    render(
      <Provider store={store}>
        <UnitList propertyId="property-1" onUnitClick={onUnitClick} />
      </Provider>
    );

    fireEvent.click(screen.getByTestId(`unit-row-${mockUnits[0].unit_number}`));
    expect(onUnitClick).toHaveBeenCalledWith(mockUnits[0]);
  });
});
