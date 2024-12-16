import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddUnitModal from '../AddUnitModal';

const mockStore = configureStore([]);

describe('AddUnitModal', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      units: {
        status: 'idle',
        error: null
      }
    });
  });

  it('renders the modal with form fields', () => {
    render(
      <Provider store={store}>
        <AddUnitModal
          propertyId="test-property-id"
          onClose={() => {}}
          onSuccess={() => {}}
        />
      </Provider>
    );

    expect(screen.getByText('Add Unit')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Floor Plan')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Provider store={store}>
        <AddUnitModal
          propertyId="test-property-id"
          onClose={onClose}
          onSuccess={() => {}}
        />
      </Provider>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
