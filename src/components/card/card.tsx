import './card.css';
import { IFCharacter } from '../../types/interface';

export const Card = (data: IFCharacter) => {
  return (
    <div className="card" role="article">
      <img className="card__image" src={data.image} alt="" />
      <p className="card__data">{data.name}</p>
      <p className="card__data">{data.species}</p>
      <p className="card__data">{data.status}</p>
    </div>
  );
};
