import { Outlet, useNavigation } from 'react-router';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { ICharacterDetails, IRespInfo } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { getList } from '../../utils/fetcher';
import { Pagination } from '../pagination/pagination';
import Loader from '../loader/loader';
import { Card } from '../card/card';
import './cardsList.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { clearSelection } from '../../state/selectedCardsSlice';
import Papa from 'papaparse';

const Results = ({ loader }: { loader: boolean }) => {
  const { page, status } = useCharacterFilters();
  const [counter, setCounter] = useState(0);
  const [loading, setLoader] = useState<boolean>(loader ? loader : true);
  const [results, setResults] = useState<ICharacterDetails[]>([]);
  const [responseInfo, setResponseInfo] = useState<IRespInfo | number>();
  const [noResults, setNoResults] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );
  const dispatch = useDispatch();

  const handleDownloadCSV = () => {
    const selectedData = results.filter((card) =>
      selectedCards.includes(card.id)
    );
    if (selectedData.length === 0) {
      alert('No cards selected for download!');
      return;
    }

    const csv = Papa.unparse(selectedData, {
      quotes: true,
      header: true,
      columns: ['id', 'title', 'image'],
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${selectedCards.length}_characters.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="results__select_controls">
          <h2>Selected: {selectedCards.length}</h2>
          <button onClick={() => dispatch(clearSelection())}>
            Deselect all
          </button>
          <button onClick={handleDownloadCSV}>Download CSV</button>
        </div>
        <div className="results__list">
          {results.length !== 0 &&
            results.map((obj: ICharacterDetails) => {
              return (
                <Link
                  to={{
                    pathname: `${obj.id}`,
                    search: `${location.search}`,
                  }}
                  key={obj.id}
                  onClick={() => handleDetailsOpen()}
                >
                  <div role="card">
                    <Card {...obj} />
                  </div>
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
              resInfo={responseInfo as IRespInfo}
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
