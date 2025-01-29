import './App.css';
import { useState } from 'react';
import SearchBar from './components/search/search-bar';
import Results from './components/results/results';
import { IFCharacter, IFResponse } from './types/interface';
import ErrorButton from './components/errButton/errorButton';

function App() {
  const [results, setResults] = useState<IFCharacter[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState(200);

  const handleDataChange = (response: IFResponse | number) => {
    if (typeof response !== 'number') {
      const results = response.results;
      setResults(results);
      setNotFound(false);
      setStatus(200);
    } else {
      setResults([]);
      setNotFound(true);
      setStatus(response);
    }
  };

  return (
    <>
      <header>
        <SearchBar onDataChange={handleDataChange} />
        <ErrorButton />
      </header>
      <main>
        <h2>Results</h2>
        {(results as IFCharacter[]).length > 0 && (
          <Results data={results as IFCharacter[]} />
        )}
        {notFound && (
          <h3>no data fetched, server replied with status {status}</h3>
        )}
      </main>
    </>
  );
}

export default App;
