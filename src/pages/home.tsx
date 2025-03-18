import './home.css';
import { useContext, useEffect, useState, useMemo } from 'react';
import CardList from '../components/card-list/cardList';
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

  const countries = useMemo(() => context?.countries || [], [context]);

  useEffect(() => {
    setData(countries);
  }, [countries]);

  const handleFilter = (region: string) => setRegion(region);

  const filteredData = useMemo(() => {
    return region ? filterByRegion(countries, region) : countries;
  }, [countries, region]);

  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const handleSearch = debounce((text: string) => {
    console.log(text);
  }, 500);

  const handleSort = (sort: string) => {
    console.log(sort);
  };

  if (!context) {
    console.log('loading');
    return <Loader />;
  }

  return (
    <div className="home">
      <div className="header">
        <h1>Countries app</h1>
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
