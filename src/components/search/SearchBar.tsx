import './search-bar.css';
import { useEffect } from 'react';
import ErrorButton from '../error-button/errorButton';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const SearchBar = ({ handleSearch }: { handleSearch: () => void }) => {
  const [searchWord, setSearchWord] = useLocalStorage('Search-Word', '');
  const { status, setFilters } = useCharacterFilters();

  const clickSearch = async () => {
    setSearchWord(status);
    handleSearch();
  };

  const changeInput = (word: string) => setFilters({ page: 1, status: word });

  useEffect(() => {
    if (!status && searchWord) setFilters({ status: searchWord, page: 1 });
  }, [setFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clickSearch();
  };
  return (
    <div className="search__bar">
      <form className="search__form" role="form" onSubmit={handleSubmit}>
        <label htmlFor="search">Search by status</label>
        <input
          value={status}
          onChange={(e) => changeInput(e.target.value.trim())}
          type="search"
          id="search"
          name="status"
          placeholder="Enter dead or alive..."
        />
        <button type="submit">Search</button>
      </form>
      <ErrorButton />
    </div>
  );
};

export default SearchBar;
