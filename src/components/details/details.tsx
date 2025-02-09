import './details.css';
import type { Params } from 'react-router';
import { getDetails } from '../../utils/fetcher';
import { useLoaderData, useNavigate, useOutletContext } from 'react-router';
import { ICharacterDetails } from '../../types/interface';

interface IFContext {
  closeClicked: () => void;
  counter: number;
}

export const Details = () => {
  const context = useOutletContext<IFContext>();
  const obj = useLoaderData() as ICharacterDetails;
  const navigate = useNavigate();

  const handleClickClose = () => {
    navigate(context?.counter > 0 ? -context.counter : -1);
    context?.closeClicked();
  };

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

export const detailsLoader = async ({ params }: { params: Params<'id'> }) => {
  const { id } = params;
  if (!id) throw new Error('Invalid character ID.');

  const res = await getDetails(id);
  if (!res) {
    throw Error('Could not found charachter details');
  }
  return res;
};
