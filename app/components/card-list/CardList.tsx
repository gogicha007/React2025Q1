import './card-list.css';
import { useLocation, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../card/Card';
import type { ICharacterDetails, IResponse } from '~/types/interface';
import type { RootState } from '~/state/store';
import PickCards from '../../state/features/pickCards/PickCards';

const Results = (data: IResponse) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const location = useLocation();

  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );

  useEffect(() => {
    setDetailsOpen(false);
  }, [data]);

  return (
    <div className="results" data-testid="results">
      {data?.results?.map((obj: ICharacterDetails) => (
        <Link
          to={{ pathname: `${obj.id}`, search: `${location.search}` }}
          key={obj.id}
          onClick={() => console.log(`${detailsOpen}`)}
        >
          <div role="card">
            <Card {...obj} />
          </div>
        </Link>
      ))}
      <div className="results__select_controls">
        {selectedCards.length > 0 && <PickCards data={data} />}
      </div>
    </div>
  );
};

export default Results;
