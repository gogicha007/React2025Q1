import './home.css';
import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { CardList } from '../components/card-list/cardList';
import Filter from '../components/filter/filter';
import Search from '../components/search/search';
import Sort from '../components/sort/sort';
import { debounce } from '../utils';
import { CountriesContext } from '../context/countriesContext';
import Loader from '../components/loader/loader';
import { filterByRegion } from '../utils';
import { ICountry } from '../types/interface';

const Home = () => {
  const context = useContext(CountriesContext);
  const [data, setData] = useState<ICountry[]>([]);
  const [region, setRegion] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('neutral');

  const countries = useMemo(() => context?.countries || [], [context]);

  useEffect(() => {
    setData(countries);
  }, [countries]);

  const handleFilter = useCallback((region: string) => setRegion(region), []);

  const filteredData = useMemo(() => {
    return region ? filterByRegion(countries, region) : countries;
  }, [countries, region]);

  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const handleSearch = useCallback(
    debounce((text: string) => setSearch(text), 500),
    []
  );

  const searchedData = useMemo(() => {
    return search
      ? countries.filter((country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        )
      : countries;
  }, [countries, search]);

  useEffect(() => {
    setData(searchedData);
  }, [searchedData]);

  const handleSort = useCallback((sort: string) => {
    console.log(sort);
    setSort(sort);
  }, []);

  const sortedData = useMemo(() => {
    if (sort === 'ascending') {
      console.log('asc');
      return [...data].sort((a, b) => a.population - b.population);
    } else if (sort === 'descending') {
      console.log('desc');
      return [...data].sort((a, b) => b.population - a.population);
    } else {
      console.log('neutral');
      return countries;
    }
  }, [sort]);

  useEffect(() => {
    setData(sortedData);
  }, [sortedData]);

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
        <CardList data={data} />
      </main>
    </div>
  );
};

export default Home;
