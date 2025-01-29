import { IFCharacter } from '../../types/interface';

const Results = ({ data }: { data: IFCharacter[] }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((obj, idx) => {
          return (
            <tr key={idx}>
              <td>{obj.name}</td>
              <td>{obj.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Results;
