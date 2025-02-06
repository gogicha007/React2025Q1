import './search-bar.css';

import { useEffect } from 'react';
import { lsHandler } from '../../utils/ls-handler';
import ErrorButton from '../errButton/errorButton';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';

const SearchBar = ({ handleSearch }: { handleSearch: () => void }) => {
  const { status, setFilters } = useCharacterFilters();

  const clickSearch = async () => {
    lsHandler.setValue(status);
    handleSearch();
  };

  const changeInput = (word: string) => setFilters({ page: 1, status: word });

  useEffect(() => {
    const searchWord = lsHandler.getValue();
    setFilters({ page: 1 });
    if (!status && searchWord) setFilters({ status: searchWord });
  }, []);

  return (
    <>
      <form className="search__bar">
        <label htmlFor="search">Search by status</label>
        <input
          value={status}
          onChange={(e) => changeInput(e.target.value.trim())}
          type="search"
          id="search"
          name="status"
          placeholder="Enter dead or alive..."
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            clickSearch();
          }}
        >
          Search
        </button>
      </form>
      <ErrorButton />
    </>
  );
};

export default SearchBar;
