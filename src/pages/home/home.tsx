import './home.css';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Tile from '../../components/tile/tile';
import { RootState } from '../../state/store';

export default function Home() {
  const location = useLocation();
  const previousPath = location.state?.from || 'No previous path';
  const navigate = useNavigate();

  const formData = useSelector((state: RootState) => state.formData.formData);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home">
      <h2>React forms</h2>
      <p>Navigated from : {previousPath}</p>
      <ul className="menu">
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick('/uncontrolled_form')}
        >
          <h2>The Plain Form</h2>
        </li>
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick('/hook_form')}
        >
          <h2>Hook Form</h2>
        </li>
      </ul>
      <div className="home__tiles">
        <h1>Data</h1>
        <div className="home__tiles_list">
          {formData.length > 0 &&
            formData.map((data, index) => <Tile key={index} data={data} />)}
        </div>
      </div>
    </div>
  );
}
