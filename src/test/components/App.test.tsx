import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { when } from 'jest-when';

import { store } from '../../../src/state';
import App from '../../components/App';
import { client } from '../../feathers';
import { dummyDemoPresentationRequestoDto, dummySession } from '../mocks';
import userEvent from '@testing-library/user-event';

jest.mock('../../feathers');

describe('app', () => {
  const mockSessionCreate = jest.fn();
  const mockPresentationRequestCreate = jest.fn();
  const mockOn = jest.fn();

  beforeEach(() => {
    mockSessionCreate.mockResolvedValueOnce(dummySession);
    mockPresentationRequestCreate.mockResolvedValueOnce(dummyDemoPresentationRequestoDto);

    when(client.service as unknown as jest.Mock)
      .calledWith('session').mockReturnValue({ create: mockSessionCreate })
      .calledWith('presentationRequest').mockReturnValue({ create: mockPresentationRequestCreate })
      .calledWith('presentation').mockReturnValue({ on: mockOn });

    render(<Provider store={store}><App /></Provider>);
  });

  it('creates a session', () => {
    expect(mockSessionCreate).toBeCalled();
  });

  it('listens for created presentations', () => {
    expect(mockOn.mock.calls[0][0]).toEqual('created');
  });

  it('shows the signup page by default', async () => {
    expect(await screen.findByText('Welcome to (Verifier)!')).toBeInTheDocument();
  });

  it('shows a primary header with a logout tab at /route1', async () => {
    const link1 = screen.getByText('Link 1');
    userEvent.click(link1);

    const logoutTab = screen.getByText('LOGOUT');
    expect(logoutTab).toBeInTheDocument();

    userEvent.click(logoutTab);

    expect(logoutTab).not.toBeInTheDocument();
    expect(await screen.findByText('Welcome to (Verifier)!')).toBeInTheDocument();
  });
});
