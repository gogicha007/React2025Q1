import styles from './search-bar.module.css';

import { useState } from 'react';
import { IFResponse } from '../../types/interface';
import { getList } from '../../utils/fetcher';
import { lsHandler } from '../../utils/ls-handler';
import Loader from '../loader/loader';

const SearchBar = ({
  onDataChange,
}: {
  onDataChange: (res: IFResponse | number) => void;
}) => {
  const [input, setInput] = useState(lsHandler.getValue() || '');
  const [loading, setLoading] = useState(false);

  const clickSearch = async () => {
    setLoading(true);
    const res = await getList(input, 1);
    setTimeout(() => {
      lsHandler.setValue(input);
      setLoading(false);
      onDataChange(res);
    }, 1000);
  };

  return (
    <div className={styles.search__bar}>
      <label htmlFor="search">Search by status</label>
      <input
        value={input}
        onInput={(e) => setInput((e.target as HTMLInputElement).value.trim())}
        type="search"
        id="search"
        name="s"
        placeholder="Enter dead or alive..."
      />
      <button onClick={clickSearch}>Search</button>
      {loading && <Loader />}
    </div>
  );
};

export default SearchBar;
