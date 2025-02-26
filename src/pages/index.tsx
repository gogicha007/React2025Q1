import SearchBar from '@/components/search/SearchBar';
import { useCharacterFilters } from '@/hooks/useCharacterFilter';
import type { IParamsType } from '@/types/interface';
import { useState } from 'react';

export default function Home() {
  const { page, status } = useCharacterFilters();
  const [params, setParams] = useState<IParamsType>({ page: 1, status: '' });
  console.log(params)
  const handleSearch = () => {
    setParams({page: +page, status: status})
  };
  
  return (
    <div className="home">
      <header className="home__top">
        <SearchBar handleSearch={handleSearch} />
      </header>
    </div>
  );
}
