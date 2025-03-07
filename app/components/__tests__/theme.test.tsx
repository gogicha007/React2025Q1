import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ThemeControls from '../theme-controls/themeControls';

describe('ThemeContext', () => {
  test('should provide default theme and toggle it', () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>
    );

    const lightRadio = screen.getByLabelText('Light') as HTMLInputElement;
    const darkRadio = screen.getByLabelText('Dark') as HTMLInputElement;

    // Check default theme (assuming default is light)
    expect(lightRadio.checked).toBe(true);
    expect(darkRadio.checked).toBe(false);

    // Toggle theme
    fireEvent.click(darkRadio);
    expect(lightRadio.checked).toBe(false);
    expect(darkRadio.checked).toBe(true);

    // Toggle back
    fireEvent.click(lightRadio);
    expect(lightRadio.checked).toBe(true);
    expect(darkRadio.checked).toBe(false);
  });
});
