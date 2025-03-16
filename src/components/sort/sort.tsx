import { useState } from 'react';
import './sort.css';

interface ISortProps {
  onChange: (sort: 'ascending' | 'descending' | 'neutral') => void;
}

const Sort = ({ onChange }: ISortProps) => {
  const [sortState, setSortState] = useState<
    'ascending' | 'descending' | 'neutral'
  >('neutral');

  const handleButtonClick = () => {
    const nextSortState =
      sortState === 'neutral'
        ? 'ascending'
        : sortState === 'ascending'
          ? 'descending'
          : 'neutral';
    setSortState(nextSortState);
    onChange(nextSortState);
  };

  return (
    <div>
      <button className="sort__button" onClick={handleButtonClick}>
        Sort by population:{' '}
        {sortState === 'neutral'
          ? 'None'
          : sortState === 'ascending'
            ? 'Ascending'
            : 'Descending'}
      </button>
    </div>
  );
};

export default Sort;
