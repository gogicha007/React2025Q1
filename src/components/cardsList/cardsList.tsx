import { Outlet, useNavigation } from 'react-router';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ICharacterDetails, IRespInfo } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { Pagination } from '../pagination/pagination';
import Loader from '../loader/loader';
import { Card } from '../card/card';
import './cardsList.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useGetListQuery } from '../../state/characters/charactersApiSlice';
import { clearSelection } from '../../state/checkCards/selectedCardsSlice';
import Papa from 'papaparse';

const Results = ({ loader }: { loader: boolean }) => {
  const { page, status } = useCharacterFilters();
  const [counter, setCounter] = useState(0);
  const [loading, setLoader] = useState<boolean>(loader ? loader : true);
  const [noResults, setNoResults] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();
  const dispatch = useDispatch();

  const { data, isFetching, error } = useGetListQuery({
    page: +page,
    status: status,
  });

  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );

  useEffect(() => {
    setLoader(isFetching);
  }, [isFetching]);

  useEffect(() => {
    if (data) {
      setNoResults(data.results.length === 0);
    }
  }, [data]);

  const handleDownloadCSV = () => {
    if (!data || !data.results) return;

    const selectedData = data.results.filter((card) =>
      selectedCards.includes(card.id)
    );

    if (selectedData.length === 0) {
      alert('No cards selected for download!');
      return;
    }

    const csv = Papa.unparse(
      selectedData.map(({ id, name, image, species, status }) => ({
        ID: id,
        Name: name,
        Image: image,
        Species: species,
        Status: status,
      })),
      {
        quotes: true,
        header: true,
      }
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${selectedCards.length}_characters.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDetailsOpen = () => {
    setDetailsOpen(true);
    setCounter((prev) => prev + 1);
  };

  const handleDetailsClose = () => {
    setCounter(0);
    setDetailsOpen(false);
  };

  return (
    <div className="results">
      <div className="results__main">
        <div className="results__select_controls">
          {selectedCards.length > 0 && (
            <h2>Items selected: {selectedCards.length}</h2>
          )}
          <button onClick={() => dispatch(clearSelection())}>
            Deselect all
          </button>
          <button onClick={handleDownloadCSV}>Download CSV</button>
        </div>
        <div className="results__list">
          {data?.results?.map((obj: ICharacterDetails) => (
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
          ))}
          {error && <h3>No data fetched</h3>}
          {noResults && <h3>No data available</h3>}
        </div>
        <div className="results__pagination">
          {data?.info && (
            <Pagination
              disabled={detailsOpen}
              resInfo={data.info as IRespInfo}
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
