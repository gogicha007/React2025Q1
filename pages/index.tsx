import styles from '../styles/Home.module.css';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import SearchBar from '@/components/search/SearchBar';
import { useCharacterFilters } from '@/hooks/useCharacterFilter';
import ThemeControls from '@/components/theme-controls/ThemeControls';
import Loader from '@/components/loader/loader';
import Results from '@/components/cards-list/CardList';
import Details from '@/components/details/Details';
import { useRouter } from 'next/router';
import { Pagination } from '@/components/pagination/Pagination';
import { useGetListQuery } from '@/state/features/characters/charactersApiSlice';
import type { IQueryError, IResponse } from '@/types/interface';
import NotFound from './404';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const page = query.page || 1;
  const status = query.status || '';

  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}${status ? `&status=${status}` : ''}`);
  const data: IResponse = await response.json();

  return {
    props: {
      initialData: data,
      initialPage: Number(page),
      initialStatus: status,
    },
  };
}
type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ initialData, initialPage, initialStatus }: HomeProps) {
  const router = useRouter();
  const { id } = router.query;
  const { page, status } = useCharacterFilters();
  const { data = initialData, isFetching, error } = useGetListQuery({
    page: +page || initialPage,
    status: status || initialStatus as string,
  });

  const handleListClick = () => {
    if (id) {
      const { id: _, ...otherParams } = router.query;
      console.log(_);
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
        {error &&
          ((error as IQueryError).status === 404 ? (
            <NotFound />
          ) : (
            <h1>Error loading data</h1>
          ))}
        {!error && (
          <div
            className={`${styles.home__main} ${id ? styles.with_details : ''}`}
          >
            <div className={styles.home__cardlist_container}>
              {data && (
                <div
                  className={styles.home__cardlist}
                  data-testid="home__cardlist"
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
