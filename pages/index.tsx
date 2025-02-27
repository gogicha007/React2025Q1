import styles from '../src/styles/Home.module.css';
import SearchBar from '@/components/search/SearchBar';
import { useCharacterFilters } from '@/hooks/useCharacterFilter';
import { useEffect } from 'react';
import ThemeControls from '@/components/theme-controls/ThemeControls';
import Loader from '@/components/loader/loader';
import Results from '@/components/cards-list/CardList';
import { Pagination } from '@/components/pagination/Pagination';
import { useGetListQuery } from '@/state/features/characters/charactersApiSlice';
import type { IQueryError } from '@/types/interface';

export default function Home() {
  const { page, status } = useCharacterFilters();
  const { data, isFetching, error } = useGetListQuery({
    page: +page,
    status: status,
  }, {
    skip: page === undefined || page === null,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  useEffect(() => {
    console.log(page, ':', status);
  }, [page, status]);

  useEffect(() => {
    console.log(page, ':', status);
    console.log(data, ':', isFetching, ':', error);
  }, [data, isFetching, error]);

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
