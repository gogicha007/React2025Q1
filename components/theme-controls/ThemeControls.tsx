import './theme-controls.css';
import { useTheme } from '../contexts/ThemeContext';

const ThemeControls = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as 'light' | 'dark');
  };

  return (
    <div className="theme-toggle">
      <label>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === 'light'}
          onChange={handleThemeChange}
        />
        Light
      </label>
      <label>
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === 'dark'}
          onChange={handleThemeChange}
        />
        Dark
      </label>
    </div>
  );
};

export default ThemeControls;