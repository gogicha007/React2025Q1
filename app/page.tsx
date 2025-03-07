'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import SearchBar from '../components/search/SearchBar';
import { useCharacterFilters } from '../hooks/useCharacterFilter';
import ThemeControls from '../components/theme-controls/ThemeControls';
import Loader from '../components/loader/loader';
import Results from '../components/cards-list/CardList';
import Details from '../components/details/Details';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '../components/pagination/Pagination';
import { useGetListQuery } from '../state/features/characters/charactersApiSlice';
import type { IQueryError, IResponse } from 'types/interface';
import NotFound from '../components/not-found/404';

export default function Home() {
  const [initialData, setInitialData] = useState<IResponse | null>(null);
  const [initialPage, setInitialPage] = useState<number>(1);
  const [initialStatus, setInitialStatus] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${initialPage}${initialStatus ? `&status=${initialStatus}` : ''}`
      );
      const data: IResponse = await response.json();
      setInitialData(data);
      setInitialPage(Number(initialPage));
      setInitialStatus(initialStatus);
    };

    fetchData();
  }, [initialPage, initialStatus]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null;
  const { page, status } = useCharacterFilters();
  const {
    data = initialData,
    isFetching,
    error,
  } = useGetListQuery({
    page: +page || initialPage,
    status: status || (initialStatus as string),
  });

  const handleListClick = () => {
    if (id) {
      const params = new URLSearchParams(
        searchParams ? searchParams.toString() : ''
      );
      params.delete('id');
      router.push(`/?${params.toString()}`);
    }
  };

  if (!initialData) {
    return <Loader />;
  }

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
