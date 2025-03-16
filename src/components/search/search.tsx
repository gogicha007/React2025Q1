import { memo } from 'react';

interface ISearchProps {
  onChange: (text: string) => void;
}

const Search = ({ onChange }: ISearchProps) => {
  return (
    <input
      type="text"
      placeholder="Search country..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default memo(Search);
