import './home.css';
import ThemeControls from '../../app/components/theme-controls/ThemeControls';
import { useState, useEffect } from 'react';
import {
  useNavigate,
  useLocation,
  Outlet,
  useLoaderData,
  useNavigation,
} from 'react-router';
import Results from '../../app/components/card-list/CardList';
import SearchBar from '../../app/components/search-bar/SearchBar';
import Loader from '../../app/components/loader/Loader';
import { useCharacterFilters } from '../../app/hooks/useCharacterFilters';
import { Pagination } from '../../app/components/pagination/Pagination';
import {
  IQueryError,
  IParamsType,
  IResponse,
  isIQueryError,
  isIResponse,
} from '../../app/types/interface';

export function meta() {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Welcome to Miami!' },
  ];
}

export async function loader({ request }: { request: Request }) {
  console.log('loader in action');
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const status = url.searchParams.get('status') || '';

  try {
    const response = await fetch(
      `http://localhost:3000/characters?page=${page}&status=${status}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { error: 'Failed to fetch data' };
  }
}

export default function Home() {
  const data = useLoaderData() as IResponse | IQueryError;
  const { setFilters } = useCharacterFilters();
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    setIsFetching(false);
  }, [data]);

  const handleSearch = (newParams: IParamsType) => {
    setIsFetching(true);
    setFilters({ status: newParams.status, page: newParams.page });
  };

  const handleListClick = () => {
    const hasIdParam = /\/\d+$/.test(location.pathname);
    console.log('has id param', hasIdParam);
    if (hasIdParam) navigate(-1);
  };

  return (
    <div className="home">
      <header className="home__top">
        <SearchBar handleSearch={handleSearch} />
        <ThemeControls />
      </header>
      <main>
        {isIQueryError(data) && <h1>{data.status}</h1>}
        {isIResponse(data) && (
          <div className="home__main">
            <div
              className="home__cardlist"
              data-testid="home__cardlist"
              onClick={() => handleListClick()}
            >
              <Results {...(data as IResponse)} />
              <div className="home__devider"></div>
              <Pagination
                resInfo={(data as IResponse).info}
                setParams={handleSearch}
              />
            </div>
            <Outlet />
          </div>
        )}
      </main>
      {navigation.state === 'loading' && <Loader />}
      {isFetching && <Loader />}
    </div>
  );
}
