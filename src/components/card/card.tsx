import './card.css';
import { ICharacterDetails } from '../../types/interface';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCardSelection } from '../../state/selectedCardsSlice';
import { RootState } from '../../state/store';

export const Card = (data: ICharacterDetails) => {
  const dispatch = useDispatch();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );
  return (
    <div className="card" role="article">
      <img className="card__image" src={data.image} alt="" />
      <p className="card__data">{data.name}</p>
      <p className="card__data">{data.species}</p>
      <p className="card__data">{data.status}</p>
      <input
        type="checkbox"
        checked={selectedCards.includes(data.id)}
        onChange={() => dispatch(toggleCardSelection(data.id))}
        className="card__checkbox"
      />
    </div>
  );
};
