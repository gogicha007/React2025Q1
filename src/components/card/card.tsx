import './card.css';
import { memo, useState } from 'react';
import { ICountry } from '../../types/interface';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type IVisitedCountries = string[];

const Card = ({ country }: { country: ICountry }) => {
  const [visitedCountries] = useLocalStorage<IVisitedCountries>('visits', []);
  const [highlighted, setHighlighted] = useState(
    visitedCountries.includes(country.cca2)
  );

  console.log(visitedCountries);
  const clickHandler = () => {
    setHighlighted(true);
    const item = window.localStorage.getItem('visits');
    if (item) {
      const visits = JSON.parse(item) as IVisitedCountries;
      if (visits.includes(country.cca2)) return;
      visits.push(country.cca2);
      window.localStorage.setItem('visits', JSON.stringify(visits));
    }
    console.log('clicked');
  };
  return (
    <div
      className={`card ${highlighted ? 'card__highlight' : ''}`}
      onClick={clickHandler}
    >
      <div className="card__info">
        <h2>{country.name.common}</h2>
        <h3>Region: {country.region}</h3>
        <h3>
          Population:{' '}
          {country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </h3>
      </div>
      <img
        className="card__flag"
        src={country.flags.png}
        alt={country.name.common}
      />
    </div>
  );
};

const areEqual = (
  prevProps: { country: ICountry },
  nextProps: { country: ICountry }
) => {
  return prevProps.country.cca2 === nextProps.country.cca2;
};

export default memo(Card, areEqual);
