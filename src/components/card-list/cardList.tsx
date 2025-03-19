import './card-list.css';
import { memo } from 'react';
import Card from '../card/card';
import { ICountry } from '../../types/interface';

const CardList = ({ data }: { data: ICountry[] }) => {
  return (
    <ul className="card-list">
      {data.map((country) => (
        <li key={country.cca2}>
          <Card key={country.cca2} country={country} />
        </li>
      ))}
    </ul>
  );
};

export default memo(CardList);
