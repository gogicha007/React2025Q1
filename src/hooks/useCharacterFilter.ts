import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ICharacterFilters } from '../types/interface';

export function useCharacterFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = useMemo(() => ({
    page: searchParams.get('page') as string || '',
    status: searchParams.get('status') as string || '',
    id: searchParams.get('id') as string
  }), [searchParams]);

  const setFilters = useCallback((newFilters: ICharacterFilters) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value])=> {
      if(value) {
        currentParams.set(key, value.toString())
      } else {
        currentParams.delete(key)
      }
    })
    const search = currentParams.toString()
    const query = search ? `?${search}`:''
    const url = `${pathname}${query}`;

    router.replace(url, {scroll: false})
  }, []);

  const page = filters.page
  const status = filters.status
  const id = filters.id

  return {
    page,
    status,
    id,
    setFilters,
  };
}
