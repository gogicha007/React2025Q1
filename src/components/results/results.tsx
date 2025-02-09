import { Link, Outlet, useNavigation, useLocation } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { IFCharacter, IFRespInfo } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { getList } from '../../utils/fetcher';
import { Pagination } from '../pagination/pagination';
import Loader from '../loader/loader';
import { Card } from '../card/card';
import './results.css';

const Results = ({ loader }: { loader: boolean }) => {
  const { page, status, setFilters } = useCharacterFilters();
  const [counter, setCounter] = useState(0);
  const [loading, setLoader] = useState<boolean>(loader ? loader : true);
  const [results, setResults] = useState<IFCharacter[]>([]);
  const [responseInfo, setResponseInfo] = useState<IFRespInfo | number>();
  const [noResults, setNoResults] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();

  const fetchList = useCallback(async () => {
    try {
      const res = await getList(+page, status as string);
      setTimeout(() => setLoader(false), 500);
      if (typeof res === 'number') {
        setResults([]);
        setResponseInfo(res);
        setNoResults(true);
      } else {
        setResults(res.results);
        setResponseInfo(res.info);
        setNoResults(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [page, status]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDetailsOpen = (charId: number) => {
    console.log(charId);
    setDetailsOpen(true);
    setCounter((prev) => prev + 1);
    setFilters({ id: charId?.toString() });
    console.log('location.search', window.location.search);
  };

  const handleDetailsClose = () => {
    setCounter(0);
    setDetailsOpen(false);
    console.log('details closed', detailsOpen);
  };

  return (
    <div className="results">
      <div className="results__main">
        <div className="results__list">
          {results.length !== 0 &&
            results.map((obj: IFCharacter) => {
              return (
                <Link
                  to={{
                    pathname: `${obj.id}`,
                    search: `${location.search.replace(
                      /([?&])id=[^&]*(&|$)/g,
                      (_, p1, p2) => {
                        return p1 === '?' ? (p2 ? '?' : '') : p2;
                      }
                    )}&id=${obj.id}`,
                  }}
                  key={obj.id}
                  onClick={() => handleDetailsOpen(obj.id)}
                >
                  <Card {...obj} />
                </Link>
              );
            })}

          {noResults && (
            <h3>
              no data fetched, server replied with status{' '}
              {(responseInfo as number).toString()}
            </h3>
          )}
        </div>
        <div className="results__pagination">
          {results.length !== 0 && (
            <Pagination
              disabled={detailsOpen}
              resInfo={responseInfo as IFRespInfo}
              handlePagination={setLoader}
            />
          )}
        </div>
      </div>
      {navigation.state === 'loading' ? (
        <Loader />
      ) : (
        <Outlet
          context={{
            closeClicked: handleDetailsClose,
            isOpen: handleDetailsOpen,
            counter: counter,
          }}
          key={location.pathname}
        />
      )}
      {loading && <Loader />}
    </div>
  );
};

export default Results;
