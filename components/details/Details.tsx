'use client';

import styles from '../../styles/Details.module.css'
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetDetailsQuery } from '../../state/features/characters/charactersApiSlice';
import Loader from '../loader/loader';

export default function Details() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null;
  const {
    data: obj,
    isFetching,
    error,
  } = useGetDetailsQuery({ id: id as string }, { skip: !id });

  const handleClickClose = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('id');
    const otherParams = Object.fromEntries(params.entries());
    const queryString = new URLSearchParams(otherParams).toString();
    router.push(`/?${queryString}`);
  };

  if (isFetching) {
    return <Loader />;
  }

  if (error || !obj) {
    return <div>Error loading character details</div>;
  }

  return (
    <div className={styles.details}>
      <div className={styles.details__data}>
        <img src={obj?.image} alt="image" />
        <p>{obj?.name}</p>
        <p>{obj?.origin?.name}</p>
        <p>{obj?.location?.name}</p>
      </div>
      <button className={styles.details__close_button} onClick={handleClickClose}>
        Close details
      </button>
    </div>
  );
}
