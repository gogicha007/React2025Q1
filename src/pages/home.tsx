import './home.css';
import { useContext, useState, useMemo, useCallback } from 'react';
import CardList from '../components/card-list/cardList';
import Filter from '../components/filter/filter';
import Search from '../components/search/search';
import Sort from '../components/sort/sort';
import { debounce, filterByRegion } from '../utils';
import { CountriesContext } from '../context/countriesContext';
import Loader from '../components/loader/loader';

const Home = () => {
  const context = useContext(CountriesContext);
  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('neutral');

  const countries = useMemo(() => context?.countries || [], [context]);

  const handleFilter = useCallback((region: string) => setRegion(region), []);

  const debouncedSearch = useMemo(
    () => debounce((text: string) => setSearch(text), 500),
    []
  );

  const handleSearch = useCallback(
    (text: string) => {
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const handleSort = useCallback((sort: string) => {
    setSort(sort);
  }, []);

  const filteredData = useMemo(() => {
    let result = countries;

    if (region) {
      result = filterByRegion(countries, region);
    }

    if (search) {
      result = result.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === 'ascending') {
      result = [...result].sort((a, b) => a.population - b.population);
    } else if (sort === 'descending') {
      result = [...result].sort((a, b) => b.population - a.population);
    }
    return result;
  }, [countries, region, search, sort]);

  if (!context) {
    console.log('loading');
    return <Loader />;
  }

  return (
    <div className="home">
      <div className="header">
        <h2>Countries app</h2>
        <div className="controls">
          <Filter onChange={handleFilter} />
          <Search onChange={handleSearch} />
          <Sort onChange={handleSort} />
        </div>
      </div>
      <main>
        <CardList data={filteredData} />
      </main>
    </div>
  );
};

export default Home;
