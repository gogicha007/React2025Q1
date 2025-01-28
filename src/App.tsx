import { Component, ReactNode } from 'react';
import './App.css';
import SearchBar from './components/search/search-bar';
import Results from './components/results/results';
import { IFCharacter, IFResponse } from './types/interface';
import ErrorButton from './components/errButton/errorButton';

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
          <ErrorButton />
        </header>
        <main>
          <h2>Results</h2>
          {this.state.results.length > 0 && (
            <Results data={this.state.results} />
          )}
          {this.state.notFound && (
            <h3>
              no data fetched, server replied with status {this.state.status}
            </h3>
          )}
        </main>
      </>
    );
  }
}

export default App;
