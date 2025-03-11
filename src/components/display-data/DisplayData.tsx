import './display-data.css';

export default function DisplayData({ data }: { data: string }) {
  return (
    <div className="display_data">
      <h1>Display Data</h1>
      <p>{data}</p>
    </div>
  );
}
