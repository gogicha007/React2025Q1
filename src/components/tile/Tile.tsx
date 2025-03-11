import './tile.css';
import { IData } from '../../types/interface';

export default function Tile({ data }: { data: IData }) {
  return (
    <div className="tile">
      <h2>{data.name}</h2>
      <p>Age: {data.age}</p>
      <p>Email: {data.email}</p>
      <p>Country: {data.country}</p>
    </div>
  );
}
