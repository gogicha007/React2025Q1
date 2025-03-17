import './filter.css';
import { useContext } from 'react';
import { CountriesContext } from '../../context/countriesContext';
import Loader from '../loader/loader';

interface IFilterProps {
  onChange: (region: string) => void;
}

const Filter = ({ onChange }: IFilterProps) => {
  const context = useContext(CountriesContext);

  if (!context) {
    return <Loader />;
  }

  const regions = [
    ...new Set(context.countries.map((country) => country.region)),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="filter">
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="">Filter by region</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
