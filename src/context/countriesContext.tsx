import { createContext, useEffect, useState, ReactNode } from 'react';
import { ICountry } from '../types/interface';

interface ICountriesContext {
  countries: ICountry[];
}

const CountriesContext = createContext<ICountriesContext | undefined>(
  undefined
);

const CountriesProvider = ({ children }: { children: ReactNode }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.log('Error fetching countries', error));
  }, []);

  return (
    <CountriesContext.Provider value={{ countries }}>
      {children}
    </CountriesContext.Provider>
  );
};

export { CountriesProvider, CountriesContext };
