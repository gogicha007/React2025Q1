import styles from './results.module.css';
import { Link, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import { IFCharacter, IFRespInfo, IFResponse } from '../../types/interface';
import { useCharacterFilters } from '../../hooks/useCharacterFilter';
import { Card } from '../card/card';
import Loader from '../loader/loader';
import { getList } from '../../utils/fetcher';

const Results = ({ loader }: { loader: boolean }) => {
  const { page, status } = useCharacterFilters();
  const [loading, setLoader] = useState<boolean>(loader ? loader : true);
  const [results, setResults] = useState<IFCharacter[]>([]);
  const [responseInfo, setRespInfo] = useState<IFRespInfo>();
  const [noResults, setNoResults] = useState(false);
  const [disabled, setDisabled] = useState(false);

  console.log(responseInfo);
  useEffect(() => {
    fetchList();
  }, [loading]);

  async function fetchList() {
    try {
      const res = await getList(+page, status as string);
      console.log('res', res);
      if (typeof res !== 'number') {
        setResults((res as IFResponse).results);
        setRespInfo((res as IFResponse).info);
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      } else {
        setLoader(false);
        setResults([]);
      }
      setNoResults(!res);
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
        {noResults && <h1>No data</h1>}
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
