import './home.css';
import { useContext } from 'react';
import { CardList } from '../components/card-list/cardList';
import Filter from '../components/filter/filter';
import Search from '../components/search/search';
import Sort from '../components/sort/sort';
import { debounce } from '../utils';
import { CountriesContext } from '../context/countriesContext';
import Loader from '../components/loader/loader';

const Home = () => {
  const context = useContext(CountriesContext);

  if (!context) {
    return <Loader />;
  }

  console.log(context);

  const handleFilter = (region: string) => {
    console.log(region);
  };

  const handleSearch = debounce((text: string) => {
    console.log(text);
  }, 500);

  const handleSort = (sort: string) => {
    console.log(sort);
  };

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
        <CardList />
      </main>
    </div>
  );
};

export default Home;
