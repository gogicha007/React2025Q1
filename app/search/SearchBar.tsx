"use client";
import './search-bar.css';
import { useEffect } from 'react';
import ErrorButton from 'app/error-button/ErrorButton';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const SearchBar = () => {
  const [searchWord, setSearchWord] = useLocalStorage('Search-Word', '');
  const { status, setFilters } = useCharacterFilters();

  useEffect(() => {
    if (!status && searchWord) setFilters({ status: searchWord, page: 1 });
    if (!status && !searchWord) setFilters({ page: 1 });
  }, [setFilters, status, searchWord]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = (formData.get('status') as string).trim();
    setSearchWord(data);
    setFilters({ status: data.trim(), page: 1 });
  };

  return (
    <div className="search__bar">
      <form className="search__form" role="form" onSubmit={handleSubmit}>
        <label htmlFor="search">Search by status</label>
        <input
          defaultValue={status}
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
