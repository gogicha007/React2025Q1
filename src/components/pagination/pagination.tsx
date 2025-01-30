import styles from './pagination.module.css';
import { IFRespInfo } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { isValidHTTPURL } from '../../utils/validator';

interface Props {
  disabled?: boolean;
  resInfo: IFRespInfo;
  handlePagination: (b: boolean) => void;
}

export const Pagination = (props: Props) => {
  const { page, setFilters } = useCharacterFilters();
  const clickPagination = (direction: 'prev' | 'next') => {
    const urlString = props.resInfo[direction];
    if (isValidHTTPURL(urlString as string)) {
      const url = new URL(urlString as string);
      const searchParams = url.searchParams.get('page');
      setFilters({ page: searchParams ? +searchParams : +page });
      props.handlePagination(true);
    } else console.error('URL string is not valid');
  };

  return (
    <>
      <nav className={styles.pgn}>
        <button
          style={{ pointerEvents: props.disabled ? 'none' : 'initial' }}
          type="submit"
          onClick={() => clickPagination('prev')}
          className={styles.pgn__button}
          disabled={!props.resInfo.prev}
        >
          &laquo;
        </button>
        <button
          style={{ pointerEvents: props.disabled ? 'none' : 'initial' }}
          type="submit"
          onClick={() => clickPagination('next')}
          className={styles.pgn__button}
          disabled={!props.resInfo.next}
        >
          &raquo;
        </button>
      </nav>
    </>
  );
};
