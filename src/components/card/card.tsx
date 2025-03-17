import './card.css';
import { ICountry } from '../../types/interface';

const Card = ({ country }: { country: ICountry }) => {
  return (
    <div className="card">
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

// const areEqual = (
//   prevProps: { country: ICountry },
//   nextProps: { country: ICountry }
// ) => {
//   return prevProps.country.cca2 === nextProps.country.cca2;
// };

// export default memo(Card, areEqual);
export default Card;
