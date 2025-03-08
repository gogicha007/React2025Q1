import {
  useNavigate,
  useOutletContext,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router';
import {
  ICharacterDetails,
  isICharacterError,
  isICharacterDetails,
  IQueryError,
} from '../types/interface';

interface IFContext {
  closeClicked: () => void;
  counter: number;
}

export async function loader({ params }: LoaderFunctionArgs) {
  console.log('details loader in action');
  const { id } = params;
  try {
    const response = await fetch(`http://localhost:3000/characters/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch data' };
  }
}

export default function Details() {
  const context = useOutletContext<IFContext>();
  const navigate = useNavigate();
  const data = useLoaderData() as ICharacterDetails | IQueryError;

  const handleClickClose = () => {
    navigate(context?.counter > 0 ? -context.counter : -1);
    context?.closeClicked();
  };

  if (isICharacterError(data)) {
    console.log('error');
    return <div>{data.data.error}</div>;
  }

  if (isICharacterDetails(data)) {
    return (
      <div className="details">
        <div className="details__data">
          <img src={data?.image} alt="image" />
          <p>{data?.name}</p>
          <p>{data?.origin?.name}</p>
          <p>{data?.location?.name}</p>
        </div>
        <button onClick={handleClickClose}>Close details</button>
      </div>
    );
  }
  return null;
}
