import { Component, ReactNode } from 'react';
import './App.css';
import SearchBar from './components/search/search-bar';
import { IFCharacter, IFResponse } from './types/interface';

class App extends Component {
  state = {
    results: [] as IFCharacter[],
    notFound: false,
    status: 200,
  };

  handleDataChange = (response: IFResponse | number) => {
    if (typeof response !== 'number') {
      const results = response.results;
      this.setState({ results: results, notFound: false, status: 200 });
    } else this.setState({ results: [], notFound: true, status: response });
  };

  render(): ReactNode {
    return (
      <>
        <header>
          <SearchBar onDataChange={this.handleDataChange} />
        </header>
        <main>
          <h2>Results</h2>
        </main>
      </>
    );
  }
}

export default App;
