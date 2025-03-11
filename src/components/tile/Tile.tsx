import './tile.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetJustAdded } from '../../state/features/form/formDataSlice';
import { IData } from '../../types/interface';

export default function Tile({ data }: { data: IData }) {
  const [highlight, setHighlight] = useState(data.justAdded);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.justAdded) {
      const timer = setTimeout(() => {
        setHighlight(false);
        dispatch(resetJustAdded());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data.justAdded, dispatch]);
  return (
    <div className={`tile ${highlight ? 'highlight' : ''}`}>
      <h3>{data.name}</h3>
      <p>Age: {data.age}</p>
      <p>Email: {data.email}</p>
      <p>Country: {data.country}</p>
    </div>
  );
}
