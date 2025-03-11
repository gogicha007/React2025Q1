import './home.css';
import { Link, useLocation } from 'react-router';

export default function Home() {
  const location = useLocation();
  const previousPath = location.state?.from || 'No previous path';
  console.log(previousPath);

  return (
    <>
      <h1>React forms</h1>
      <p>Navigated from : {previousPath}</p>
      <ul className="menu">
        <li className="menu_item">
          <Link to="/uncontrolled_form">The Plain Form</Link>
        </li>
        <li className="menu_item">
          <Link to="/hook_form">Hook Form</Link>
        </li>
      </ul>
    </>
  );
}
