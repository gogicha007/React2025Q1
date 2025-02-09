import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { CharacterFilters } from '../types/interface';

export function useCharacterFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page') as string;
  const status = searchParams.get('status') as string;

  const setFilters = useCallback((filters: CharacterFilters) => {
    setSearchParams((params) => {
      if (filters.page !== undefined) {
        params.set('page', filters.page.toString());
      }
      if (filters.status !== undefined) {
        params.set('status', filters.status);
      }
      return params;
    });
  }, []);

  return {
    page,
    status,
    setFilters,
  };
}
