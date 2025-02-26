import './pagination.css';
import type { IRespInfo, IParamsType } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { isValidHTTPURL } from '../../utils/validator';
import type { Dispatch } from 'react';

interface Props {
  disabled?: boolean;
  resInfo: IRespInfo;
  setParams: Dispatch<IParamsType>;
}

export const Pagination = (props: Props) => {
  const { page, setFilters } = useCharacterFilters();

  const clickPagination = (direction: 'prev' | 'next') => {
    const urlString = props.resInfo[direction];
    if (isValidHTTPURL(urlString as string)) {
      const url = new URL(urlString as string);
      const searchPage = url.searchParams.get('page') || 1;
      const searchStatus = url.searchParams.get('status') || '';
      setFilters({ page: searchPage ? +searchPage : +page });
      props.setParams({ page: +searchPage, status: searchStatus });
    } else console.error('URL string is not valid');
  };

  return (
    <>
      <nav className="pgn">
        <button
          style={{ pointerEvents: props.disabled ? 'none' : 'initial' }}
          type="submit"
          onClick={() => clickPagination('prev')}
          className="pgn__button"
          disabled={!props.resInfo.prev}
        >
          &laquo;
        </button>
        <button
          style={{ pointerEvents: props.disabled ? 'none' : 'initial' }}
          type="submit"
          onClick={() => clickPagination('next')}
          className="pgn__button"
          disabled={!props.resInfo.next}
        >
          &raquo;
        </button>
      </nav>
    </>
  );
};
