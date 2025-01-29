import styles from './search-bar.module.css';

import { useEffect, useState } from 'react';
import { IFResponse } from '../../types/interface';
import { getList } from '../../utils/fetcher';
import { lsHandler } from '../../utils/ls-handler';
import Loader from '../loader/loader';
import ErrorButton from '../errButton/errorButton';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';

const SearchBar = ({
  handleSearch,
}: {
  handleSearch: (res: IFResponse | number) => void;
}) => {
  const { status, setFilters } = useCharacterFilters();
  const [input, setInput] = useState(lsHandler.getValue() || '');
  const [loading, setLoading] = useState(false);

  const clickSearch = async () => {
    setLoading(true);
    const res = await getList(input, 1);
    setTimeout(() => {
      lsHandler.setValue(input);
      setLoading(false);
      handleSearch(res);
    }, 1000);
  };

  const changeInput = (word: string) => {
    setFilters({ page: 1, status: word });
  };

  useEffect(() => {
    const searchWord = lsHandler.getValue();
    setFilters({ page: 1 });
    if (!status && searchWord) setFilters({ status: searchWord });
  }, []);
  return (
    <>
      <form className={styles.search__bar}>
        <label htmlFor="search">Search by status</label>
        <input
          value={status}
          onChange={(e) => changeInput(e.target.value)}
          onInput={(e) => setInput((e.target as HTMLInputElement).value.trim())}
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
        {loading && <Loader />}
      </form>
      <ErrorButton />
    </>
  );
};

export default SearchBar;
