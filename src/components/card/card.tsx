import './card.css';
import { ICountry } from '../../types/interface';

export const Card = ({ country }: { country: ICountry }) => {
  return (
    <div className="card">
      <h2>{country.name.common}</h2>
      <img src={country.flags.png} alt={country.name.common} />
      <p>Region: {country.region}</p>
      <p>
        Population:{' '}
        {country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </p>
    </div>
  );
};
