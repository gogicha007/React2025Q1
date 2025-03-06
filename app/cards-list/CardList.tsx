"use client"
import './card-list.css';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '../card/card';
import type { ICharacterDetails, IResponse } from '../../types/interface';
import type { RootState } from '../../state/store';
import PickCards from '../../state/features/pickCards/PickCards';

const Results = (data: IResponse) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );

  const handleCardClick = (
    e: React.MouseEvent,
    character: ICharacterDetails
  ) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('id', character.id.toString());
    router.push(`/?${params.toString()}`);
  };

  const isSelected = (id: string | number) => {
    return searchParams?.get('id') === id.toString();
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