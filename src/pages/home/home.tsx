// import './home.css';
// import ThemeControls from '../../components/theme-controls/ThemeControls';
// import { useGetListQuery } from '../../state/features/characters/charactersApiSlice';
// import { useState } from 'react';
// import { useCharacterFilters } from '../../hooks/useCharacterFilter';
// import Results from '../../components/cards-list/CardList';
// import SearchBar from '../../components/search/SearchBar';
// import Loader from '../../components/loader/loader';
// import { Pagination } from '../../components/pagination/pagination';
// import { IQueryError, IParamsType } from '../../types/interface';

// export function meta() {
//   return [
//     { title: 'React Router App' },
//     { name: 'description', content: 'Welcome to Miami!' },
//   ];
// }

// export default function Home() {
//   const { page, status } = useCharacterFilters();
//   const [params, setParams] = useState<IParamsType>({ page: 1, status: '' });
//   const { data, isFetching, error } = useGetListQuery({
//     page: +params.page,
//     status: params.status,
//   });


//   const handleSearch = () => {
//     setParams({ page: +page, status: status });
//   };

//   const handleListClick = () => {
//     const hasIdParam = /\/\d+$/.test(location.pathname);
//     console.log('has id param', hasIdParam);
//     if (hasIdParam) navigate(-1);
//   };
//   return (
//     <div className="home">
//       <header className="home__top">
//         <SearchBar handleSearch={handleSearch} />
//         <ThemeControls />
//       </header>
//       <main>
//         {error && <h1>{(error as IQueryError).status}</h1>}
//         {!error && data && (
//           <div className="home__main">
//             <div
//               className="home__cardlist"
//               data-testid="home__cardlist"
//               onClick={() => handleListClick()}
//             >
//               <Results {...data} />
//               <div className="home__devider"></div>
//               <Pagination resInfo={data.info} setParams={setParams} />
//             </div>
//             <Outlet />
//           </div>
//         )}
//       </main>
//       {isFetching && <Loader />}
//     </div>
//   );
// }
