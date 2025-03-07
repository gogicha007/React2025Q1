import { Component } from 'react';
import { IFCharacter } from '../../types/interface';

class Results extends Component<{ data: IFCharacter[] }> {
  render() {
    if (this.props.data.length === 0) {
      console.log('error');
      throw new Error('its error');
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((obj, idx) => {
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
  }
}

export default Results;
