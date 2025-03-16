import './home.css';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Tile from '../../components/tile/Tile';
import { RootState } from '../../state/store';
import { getBaseURL } from '../../utils/utils';

const baseURL = getBaseURL();

export default function Home() {
  const navigate = useNavigate();

  const formData = useSelector((state: RootState) => state.formData.formData);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home">
      <h2>React forms</h2>
      <ul className="menu">
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick(`${baseURL}uncontrolled_form`)}
        >
          <h2>Plain Form</h2>
        </li>
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick(`${baseURL}hook_form`)}
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
