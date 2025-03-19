export interface ICountry {
  cca2: string;
  name: {
    common: string;
    official: string;
  };
  region: string;
  population: number;
  flags: {
    png: string;
  };
}
