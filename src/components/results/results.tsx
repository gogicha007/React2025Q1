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
  const { page, status } = useCharacterFilters();
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

  const handleDetailsOpen = () => {
    setDetailsOpen(true);
    setCounter((prev) => prev + 1);
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
                    search: `${location.search}`,
                  }}
                  key={obj.id}
                  onClick={() => handleDetailsOpen()}
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
        />
      )}
      {loading && <Loader />}
    </div>
  );
};

export default Results;
