import './search-bar.css';
import ErrorButton from '../error-button/ErrorButton';
import { useCharacterFilters } from '../../hooks/useCharacterFilters';

const SearchBar = ({
  handleSearch,
}: {
  handleSearch: (params: { page: number; status: string }) => void;
}) => {
  const { status } = useCharacterFilters();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const search = new FormData(e.currentTarget);
    const status = (search.get('status') as string).trim();
    handleSearch({ page: 1, status });
  };

  return (
    <div className="search__bar">
      <form className="search__form" role="form" onSubmit={handleSubmit}>
        <label htmlFor="search">Search by status</label>
        <input
          defaultValue={status}
          type="search"
          id="search"
          name="status"
          placeholder="Enter dead or alive..."
        />
        <button type="submit">Search</button>
      </form>
      <ErrorButton />
    </div>
  );
};

export default SearchBar;
