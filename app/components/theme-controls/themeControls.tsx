import './themeControls.css';
import { useTheme } from '../../context/ThemeContext';

const ThemeControls = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <label>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === 'light'}
          onChange={toggleTheme}
        />
        Light
      </label>
      <label>
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        Dark
      </label>
    </div>
  );
};

export default ThemeControls;
