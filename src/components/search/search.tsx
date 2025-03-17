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

export default Search;
