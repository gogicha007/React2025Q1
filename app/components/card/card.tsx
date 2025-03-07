import './card.css';
import type { ICharacterDetails } from '../../types/interface';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCardSelection } from '../../state/features/pickCards/selectedCardsSlice';
import type { RootState } from '../../state/store';

export const Card = (data: ICharacterDetails) => {
  const dispatch = useDispatch();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );

  const handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
    dispatch(toggleCardSelection(data.id));
  };

  return (
    <div className="card" role="article">
      <img className="card__image" src={data.image} alt="character image" />
      <p className="card__data">{data.name}</p>
      <p className="card__data">{data.species}</p>
      <p className="card__data">{data.status}</p>
      <input
        className="card__checkbox card__checkbox-enlarged"
        type="checkbox"
        checked={selectedCards.includes(data.id)}
        onClick={handleCheckboxClick}
        defaultChecked={false}
      />
    </div>
  );
};
