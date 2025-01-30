import styles from './results.module.css';
import { Link, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import { IFCharacter, IFRespInfo } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { Card } from '../card/card';
import Loader from '../loader/loader';
import { getList } from '../../utils/fetcher';

const Results = ({ loader }: { loader: boolean }) => {
  const { page, status } = useCharacterFilters();
  const [loading, setLoader] = useState<boolean>(loader ? loader : true);
  const [results, setResults] = useState<IFCharacter[]>([]);
  const [responseInfo, setRespInfo] = useState<IFRespInfo | number>();
  const [noResults, setNoResults] = useState(false);
  const [disabled, setDisabled] = useState(false);

  console.log(responseInfo);
  useEffect(() => {
    fetchList();
  }, [loading]);

  async function fetchList() {
    try {
      const res = await getList(+page, status as string);
      setTimeout(() => {
        setLoader(false);
      }, 500);
      setResults(typeof res === 'number' ? [] : res.results);
      setRespInfo(typeof res === 'number' ? res : res.info);
      setNoResults(typeof res === 'number');
    } catch (error) {
      console.error(error);
    }
  }
  const handleDetailsOpen = () => {
    setDisabled(true);
    console.log('details opened', disabled);
  };
  const handleDetailsClose = () => {
    console.log('details closed');
    setDisabled(false);
  };
  return (
    <div className={styles.results}>
      <div className={styles.results__list}>
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
      {loading && <Loader />}
      <Outlet
        context={{
          closeClicked: handleDetailsClose,
          isOpen: handleDetailsOpen,
        }}
      />
    </div>
  );
};

export default Results;
