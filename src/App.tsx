import './App.css';
import { CardList } from './components/card-list/cardList';
import { CountriesProvider } from './context/countriesContext';

function App() {
  return (
    <CountriesProvider>
      <div>
        <h1>Countries app</h1>
        <div>drop down menu</div>
        <div>search bar</div>
        <div>sort</div>
        <CardList />
      </div>
    </CountriesProvider>
  );
}

export default App;
