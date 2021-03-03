import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { when } from 'jest-when';

import { store } from '../../../src/state';
import App from '../../components/App';
import { client } from '../../feathers';
import { dummyDemoPresentationRequestoDto, dummySession } from '../mocks';

jest.mock('../../feathers', () => ({
  client: {
    service: jest.fn()
  }
}));

describe('app', () => {
  const mockSessionCreate = jest.fn();
  const mockPresentationRequestCreate = jest.fn();

  beforeEach(() => {
    mockSessionCreate.mockResolvedValueOnce(dummySession);
    mockPresentationRequestCreate.mockResolvedValueOnce(dummyDemoPresentationRequestoDto);

    when(client.service as unknown as jest.Mock)
      .calledWith('session').mockReturnValue({ create: mockSessionCreate })
      .calledWith('presentationRequest').mockReturnValue({ create: mockPresentationRequestCreate });

    render(<Provider store={store}><App /></Provider>);
  });

  it('creates a session', () => {
    expect(mockSessionCreate).toBeCalled();
  });

  it('shows the signup page by default', async () => {
    expect(await screen.findByText('Welcome to (Verifier)!')).toBeInTheDocument();
  });
});
