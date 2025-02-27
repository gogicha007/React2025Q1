import styles from '../src/styles/Home.module.css';
import SearchBar from '@/components/search/SearchBar';
import { useCharacterFilters } from '@/hooks/useCharacterFilter';
import { useEffect } from 'react';
import ThemeControls from '@/components/theme-controls/themeControls';
import Loader from '@/components/loader/loader';
import Results from '@/components/cards-list/CardList';
import { Pagination } from '@/components/pagination/pagination';
import { useGetListQuery } from '@/state/features/characters/charactersApiSlice';
import type { IQueryError } from '@/types/interface';

export default function Home() {
  const { page, status } = useCharacterFilters();
  const { data, isFetching, error } = useGetListQuery(
    {
      page: +page,
      status: status,
    },
    {
      skip: !page,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect:true,
    }
  );

  useEffect(() => {
    console.log('Page:', page, 'Status:', status);
    console.log('Data:', data);
    console.log('Fetching:', isFetching);
    console.log('Error:', error);
  }, [data, isFetching, error, page, status]);

  const handleListClick = () => {
    const hasIdParam = /\/\d+$/.test(location.pathname);
    console.log('has id param', hasIdParam);
    // if (hasIdParam) navigate(-1);
  };

  return (
    <div className={styles.home}>
      <header className={styles.home__top}>
        <SearchBar />
        <ThemeControls />
      </header>
      <main>
        {error && <h1>{(error as IQueryError).status}</h1>}
        {!error && data && (
          <div className={styles.home__main}>
            <div
              className={styles.home__cardlist}
              data-testid={styles.home__cardlist}
              onClick={() => handleListClick()}
            >
              <Results {...data} />
              <div className={styles.home__devider}></div>
              <Pagination resInfo={data.info} />
            </div>
          </div>
        )}
      </main>
      {isFetching && <Loader />}
    </div>
  );
}
