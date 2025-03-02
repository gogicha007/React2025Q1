import './card-list.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Card } from '../card/card';
import type { ICharacterDetails, IResponse } from '../../types/interface';
import type { RootState } from '../../state/store';
import PickCards from '../../state/features/pickCards/PickCards';

const Results = (data: IResponse) => {
  const router = useRouter();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );

  const handleCardClick = (
    e: React.MouseEvent,
    character: ICharacterDetails
  ) => {
    e.preventDefault();
    router.push(
      {
        pathname: '/',
        query: {
          ...router.query,
          id: character.id,
        },
      },
      undefined,
      { shallow: true }
    );
  };
  const isSelected = (id: string | number) => {
    return router.query.id === id.toString();
  };

  return (
    <div className="results" data-testid="results">
      {data?.results?.map((obj: ICharacterDetails) => (
        <div
          key={obj.id}
          onClick={(e) => handleCardClick(e, obj)}
          role="card"
          className={`card-wrapper ${isSelected(obj.id) ? 'selected' : ''}`}
        >
          <Card {...obj} />
        </div>
      ))}
      <div className="results__select_controls">
        {selectedCards.length > 0 && <PickCards data={data} />}
      </div>
    </div>
  );
};

export default Results;
