import styles from './details.module.css';
import type { Params } from 'react-router';
import { getDetails } from '../../utils/fetcher';
import { useLoaderData, useNavigate, useOutletContext } from 'react-router';
import { useEffect, useRef, useState } from 'react';

interface IFContext {
  closeClicked: () => void;
  isOpen: () => void;
}

export const Details = () => {
  const [count, setCount] = useState(0);
  const effectRan = useRef(false);
  const context = useOutletContext() as IFContext;
  const obj = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (effectRan.current === true) {
      setCount((prevValue) => prevValue + 1);
    }
  }, [obj]);

  useEffect(() => {
    if (effectRan.current === true) context.isOpen();
    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleClickClose = () => {
    navigate(-count);
    setCount(0);
    context.closeClicked();
  };

  return (
    <>
      <div className={styles.details}>
        <img src={obj.image} alt="image" />
        <p>{obj.origin.name}</p>
        <p>{obj.location.name}</p>
      </div>
      <button onClick={handleClickClose}>Close details</button>
    </>
  );
};

export const detailsLoader = async ({ params }: { params: Params<'id'> }) => {
  const { id } = params;
  const res = await getDetails(id as string);
  if (!res) {
    throw Error('Could not found charachter details');
  }
  return res;
};
