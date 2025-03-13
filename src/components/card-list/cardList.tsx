import './card-list.css';
import { useContext } from 'react';
import { Card } from '../card/card';
import Loader from '../loader/loader';
import { CountriesContext } from '../../context/countriesContext';

const CardList = () => {
  const context = useContext(CountriesContext);

  if (!context) {
    return <Loader />;
  }

  const { countries } = context;
  return (
    <div className="card-list">
      {countries.map((country) => (
        <Card key={country.cca2} country={country} />
      ))}
    </div>
  );
};

export { CardList };
