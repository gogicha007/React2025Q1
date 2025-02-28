import styles from '../../../styles/Details.module.css'
import { useRouter } from 'next/router';
import { useGetDetailsQuery } from '@/state/features/characters/charactersApiSlice';
import Loader from '../loader/loader';

export default function Details() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: obj,
    isFetching,
    error,
  } = useGetDetailsQuery({ id: id as string }, { skip: !id });

  const handleClickClose = () => {
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
