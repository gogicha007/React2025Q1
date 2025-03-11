import './home.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Tile from '../../components/tile/tile';
import { RootState } from '../../state/store';

export default function Home() {
  const [justAdded, setJustAdded] = useState(false);
  const location = useLocation();
  const previousPath = location.state?.from || 'No previous path';
  const navigate = useNavigate();
  console.log(previousPath);

  const formData = useSelector((state: RootState) => state.formData.formData);
  console.log('form data', formData);

  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => {
        setJustAdded(false);
        console.log('reset is done');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home">
      <h2>React forms</h2>
      <p>Navigated from : {previousPath}</p>
      <ul className="menu">
        <li
          className={`menu_item ${justAdded ? 'data_changed' : ''}`}
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
      <div>
        <h1>Data</h1>
        {formData.length > 0 &&
          formData.map((data, index) => <Tile key={index} data={data} />)}
      </div>
      {/* <DisplayData data={plainFormData} /> */}
    </div>
  );
}
