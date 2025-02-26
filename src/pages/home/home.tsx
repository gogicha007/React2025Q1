import './home.css';
import { useState } from 'react';
import SearchBar from '../../components/search/search-bar';
import Results from '../../components/cardsList/cardsList';
import ThemeControls from '../../components/theme-controls/themeControls';

function HomePage() {
  const [loading, setLoader] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const handleSearch = () => {
    setLoader(true);
    setTrigger((prev) => prev + 1);
  };

  return (
    <div className="home">
      <header className="home__top">
        <SearchBar handleSearch={handleSearch} />
        <ThemeControls />
      </header>
      <main>
        <Results loader={loading} key={trigger} />
      </main>
    </div>
  );
}

export default HomePage;
