import './App.css';
import { CountriesProvider } from './context/countriesContext';
import Home from './pages/home';

function App() {
  return (
    <CountriesProvider>
      <Home />
    </CountriesProvider>
  );
}

export default App;
