import { render, screen, fireEvent } from '@testing-library/react';
import ErrorButton from '../error-button/ErrorButton';

describe('ErrorButton', () => {
  test('should throw an error when clicked', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<ErrorButton />);
      fireEvent.click(screen.getByText('Error Thrower'));
    }).toThrow('Error throwing button was clicked');

    consoleErrorSpy.mockRestore();
  });
});
