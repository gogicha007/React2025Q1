import './App.css';
import { Route, Routes } from 'react-router';
import HomePage from './pages/home/home';
import NotFound from './pages/notfound/notfound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
