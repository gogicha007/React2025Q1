import './home.css';
import { useState } from 'react';
import SearchBar from '../../components/search/search-bar';
import Results from '../../components/cardsList/cardsList';
import { useTheme } from '../../contexts/ThemeContext';

function HomePage() {
  const [loading, setLoader] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const handleSearch = () => {
    setLoader(true);
    setTrigger((prev) => prev + 1);
  };

  return (
    <div className="home">
      <header className="home__top">
        <SearchBar handleSearch={handleSearch} />
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
      </header>
      <main>
        <Results loader={loading} key={trigger} />
      </main>
    </div>
  );
}

export default HomePage;
