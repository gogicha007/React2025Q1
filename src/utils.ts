import { ICountry } from './types/interface';

export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function filterByRegion(
  countries: ICountry[],
  region: string
): ICountry[] {
  return countries.filter((country) => country.region === region);
}
