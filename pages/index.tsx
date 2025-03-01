import styles from '../styles/Home.module.css';
import SearchBar from '@/components/search/SearchBar';
import { useCharacterFilters } from '@/hooks/useCharacterFilter';
import ThemeControls from '@/components/theme-controls/ThemeControls';
import Loader from '@/components/loader/loader';
import Results from '@/components/cards-list/CardList';
import Details from '@/components/details/Details';
import { useRouter } from 'next/router';
import { Pagination } from '@/components/pagination/Pagination';
import { useGetListQuery } from '@/state/features/characters/charactersApiSlice';
import type { IQueryError } from '@/types/interface';
import NotFound from './404';

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const { page, status } = useCharacterFilters();
  const { data, isFetching, error } = useGetListQuery({
    page: +page,
    status: status,
  });

  const handleListClick = () => {
    if (id) {
      const { id: _, ...otherParams } = router.query;
      console.log(_)
      router.push(
        {
          pathname: '/',
          query: otherParams,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <div className={styles.home}>
      <header className={styles.home__top}>
        <SearchBar />
        <ThemeControls />
      </header>
      <main>
        {error && ((error as IQueryError).status === 404 ? <NotFound/> : <h1>Error loading data</h1>)}
        {!error && (
          <div
            className={`${styles.home__main} ${id ? styles.with_details : ''}`}
          >
            <div className={styles.home__cardlist_container}>
              {data && (
                <div
                  className={styles.home__cardlist}
                  data-testid='home__cardlist'
                  onClick={() => handleListClick()}
                >
                  <Results {...data} />
                  <div className={styles.home__devider}></div>
                  <Pagination resInfo={data.info} />
                </div>
              )}
            </div>
            <div>

            {id && (
              <div className={styles.details_panel}>
                <Details />
              </div>
            )}
            </div>
          </div>
        )}
      </main>
      {isFetching && <Loader />}
    </div>
  );
}
