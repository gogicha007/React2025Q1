import './display-data.css';
import { IData } from '../../types/interface';

export default function DisplayData({ data }: { data: IData }) {
  return (
    <div className="display_data">
      <h1>Display Data</h1>
      <p>{data.country}</p>
    </div>
  );
}
