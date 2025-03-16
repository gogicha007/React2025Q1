import './card-list.css';
import Card from '../card/card';
import { ICountry } from '../../types/interface';

const CardList = ({ data }: { data: ICountry[] }) => {
  return (
    <div className="card-list">
      {data.map((country) => (
        <Card key={country.cca2} country={country} />
      ))}
    </div>
  );
};

export { CardList };
