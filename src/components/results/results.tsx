import { Link, Outlet, useNavigation } from 'react-router';
import { useEffect, useState } from 'react';
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
  const [responseInfo, setRespInfo] = useState<IFRespInfo | number>();
  const [noResults, setNoResults] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchList();
  }, [loading]);

  async function fetchList() {
    try {
      const res = await getList(+page, status as string);
      setTimeout(() => setLoader(false), 500);
      setResults(typeof res === 'number' ? [] : res.results);
      setRespInfo(typeof res === 'number' ? res : res.info);
      setNoResults(typeof res === 'number');
    } catch (error) {
      console.error(error);
    }
  }

  const handleDetailsOpen = () => {
    setDisabled(true);
    setCounter((prev) => prev + 1);
    console.log('details opened', disabled);
  };
  const handleDetailsClose = () => {
    console.log('details closed');
    setCounter(0);
    setDisabled(false);
  };

  return (
    <div className="results">
      <div className="results__main">
        <div className="results__list">
          {results.length !== 0 &&
            results.map((obj: IFCharacter) => {
              return (
                <Link to={{ pathname: `${obj.id.toString()}` }} key={obj.id}>
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
              disabled={disabled}
              resInfo={responseInfo as IFRespInfo}
              handlePagination={setLoader}
            />
          )}
        </div>
      </div>
      {loading && <Loader />}
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
    </div>
  );
};

export default Results;
