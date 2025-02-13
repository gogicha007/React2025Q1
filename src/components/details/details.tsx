import './details.css';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useGetDetailsQuery } from '../../state/characters/charactersApiSlice';
import Loader from '../loader/loader';

interface IFContext {
  closeClicked: () => void;
  counter: number;
}

export const Details = () => {
  const context = useOutletContext<IFContext>();
  const { id } = useParams();
  // console.log('details id', id);
  const navigate = useNavigate();

  const {
    data: obj,
    isFetching,
    error,
  } = useGetDetailsQuery({ id: id as string });
  // console.log('details obj', obj);
  const handleClickClose = () => {
    navigate(context?.counter > 0 ? -context.counter : -1);
    context?.closeClicked();
  };

  if (isFetching) {
    return <Loader />;
  }

  if (error || !obj) {
    return <div>Error loading character details</div>;
  }

  return (
    <div className="details">
      <div className="details__data">
        <img src={obj?.image} alt="image" />
        <p>{obj?.name}</p>
        <p>{obj?.origin?.name}</p>
        <p>{obj?.location?.name}</p>
      </div>
      <button onClick={handleClickClose}>Close details</button>
    </div>
  );
};
