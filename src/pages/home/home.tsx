import './home.css';
import { Link } from 'react-router';

export default function Home() {
  return (
    <>
      <h1>React forms</h1>
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
