import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useGetListQuery } from '../state/features/characters/charactersApiSlice';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('../state/features/characters/charactersApiSlice', () => ({
  useGetListQuery: jest.fn(),
}));

jest.mock('../components/search/SearchBar', () => () => <div>SearchBar</div>);
jest.mock('../components/theme-controls/ThemeControls', () => () => (
  <div>ThemeControls</div>
));

describe('Home Component', () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();
  const mockPathname = '/';

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Loader when initialData is null and data is not available', () => {
    (useGetListQuery as jest.Mock).mockReturnValue({
      data: null,
      isFetching: true,
      error: null,
    });

    render(<Home />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

});
