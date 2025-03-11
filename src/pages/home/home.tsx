import './home.css';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import DisplayData from '../../components/display-data/DisplayData';
import { RootState } from '../../state/store';
import { resetIsDataChanged } from '../../state/features/plain-form/plainFormSlice';

export default function Home() {
  const location = useLocation();
  const previousPath = location.state?.from || 'No previous path';
  const navigate = useNavigate();
  console.log(previousPath);

  const dispatch = useDispatch();
  const { plainFormData, isPlainDataChanged } = useSelector(
    (state: RootState) => state.plainForm
  );

  useEffect(() => {
    if (isPlainDataChanged) {
      const timer = setTimeout(() => {
        console.log('reset is done');
        dispatch(resetIsDataChanged());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isPlainDataChanged, dispatch]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <h1>React forms</h1>
      <p>Navigated from : {previousPath}</p>
      <ul className="menu">
        <li
          className={`menu_item ${isPlainDataChanged ? 'data_changed' : ''}`}
          onClick={() => handleMenuItemClick('/uncontrolled_form')}
          style={{ borderColor: isPlainDataChanged ? 'red' : '#e0e0e0' }}
        >
          <h2>The Plain Form</h2>
          <DisplayData data={plainFormData} />
        </li>
        <li
          className="menu_item"
          onClick={() => handleMenuItemClick('/hook_form')}
        >
          <h2>Hook Form</h2>
          <DisplayData data={plainFormData} />
        </li>
      </ul>
    </>
  );
}
