import styles from '../styles/Home.module.css';
import SearchBar from '@/components/search/SearchBar';
import { useCharacterFilters } from '@/hooks/useCharacterFilter';
// import { useEffect } from 'react';
import ThemeControls from '@/components/theme-controls/ThemeControls';
import Loader from '@/components/loader/loader';
import Results from '@/components/cards-list/CardList';
import Details from '@/components/details/Details';
import { useRouter } from 'next/router';
import { Pagination } from '@/components/pagination/Pagination';
import { useGetListQuery } from '@/state/features/characters/charactersApiSlice';
import type { IQueryError } from '@/types/interface';

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const { page, status } = useCharacterFilters();
  const { data, isFetching, error } = useGetListQuery({
    page: +page,
    status: status,
  });

  // useEffect(() => {
  //   console.log('Page:', page, 'Status:', status);
  //   console.log('Data:', data);
  //   console.log('Fetching:', isFetching);
  //   console.log('Error:', error);
  // }, [data, isFetching, error, page, status]);

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
        {!error && (
          <div
            className={`${styles.home_main} ${id ? styles.with_details : ''}`}
          >
            <div className={styles.home__cardlist_container}>
              {data && (
                <div
                  className={styles.home__cardlist}
                  data-testid={styles.home__cardlist}
                  onClick={() => handleListClick()}
                >
                  <Results {...data} />
                  <div className={styles.home__devider}></div>
                  <Pagination resInfo={data.info} />
                </div>
              )}
            </div>
            {id && (
              <div className={styles.details_panel}>
                <Details />
              </div>
            )}
          </div>
        )}
      </main>
      {isFetching && <Loader />}
    </div>
  );
}
