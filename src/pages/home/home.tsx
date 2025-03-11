import './home.css';
import { useLocation, useNavigate } from 'react-router';
import DisplayData from '../../components/display-data/DisplayData';
import { store } from '../../state/store';

export default function Home() {
  const location = useLocation();
  const previousPath = location.state?.from || 'No previous path';
  const navigate = useNavigate();
  console.log(previousPath);

  store.subscribe(() => {
    console.log('State changed', store.getState());
  });

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <h1>React forms</h1>
      <p>Navigated from : {previousPath}</p>
      <ul className="menu">
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick('/uncontrolled_form')}
        >
          <h2>The Plain Form</h2>
          <DisplayData data={'uncontrolled form data'} />
        </li>
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick('/hook_form')}
        >
          <h2>Hook Form</h2>
          <DisplayData data={'hook form data'} />
        </li>
      </ul>
    </>
  );
}
