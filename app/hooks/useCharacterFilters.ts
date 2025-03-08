import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import type { ICharacterFilters } from '../types/interface';

export function useCharacterFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page') as string;
  const status = searchParams.get('status') as string;
  const id = searchParams.get('id') as string;

  const setFilters = useCallback((filters: ICharacterFilters) => {
    setSearchParams((params) => {
      if (filters.page !== undefined) {
        params.set('page', filters.page.toString());
      }
      if (filters.status !== undefined) {
        params.set('status', filters.status);
      }
      if (filters.id !== undefined) {
        params.set('id', filters.id);
      }
      return params;
    });
  }, []);

  return {
    page,
    status,
    id,
    setFilters,
  };
}
