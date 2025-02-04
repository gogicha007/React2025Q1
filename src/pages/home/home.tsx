import './home.css';
import { useState } from 'react';
import SearchBar from '../../components/search/search-bar';
import Results from '../../components/results/results';

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
      </header>
      <main>
        <Results loader={loading} key={trigger} />
      </main>
    </div>
  );
}

export default HomePage;
