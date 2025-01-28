import styles from './search-bar.module.css';

import { Component } from 'react';
import { IFResponse } from '../../types/interface';
import { getList } from '../../utils/fetcher';
import { lsHandler } from '../../utils/ls-handler';
import Loader from '../loader/loader';

class SearchBar extends Component<
  { onDataChange: (res: IFResponse | number) => void },
  { input: string; loading: boolean }
> {
  constructor(props: { onDataChange: (res: IFResponse | number) => void }) {
    super(props);
    this.state = {
      input: lsHandler.getValue() || '',
      loading: false,
    };
    this.clickSearch = this.clickSearch.bind(this);
  }

  clickSearch = async () => {
    this.setState({ loading: true });
    const res = await getList(this.state.input, 1);
    setTimeout(() => {
      lsHandler.setValue(this.state.input);
      this.setState({ loading: false });
      this.props.onDataChange(res);
    }, 1000);
  };

  render() {
    return (
      <div className={styles.search__bar}>
        <label htmlFor="search">Search the status</label>
        <input
          value={this.state.input}
          onInput={(e) =>
            this.setState({
              input: (e.target as HTMLInputElement).value.trim(),
            })
          }
          type="search"
          id="search"
          name="s"
          placeholder="Enter dead or alive..."
        />
        <button onClick={this.clickSearch}>Search</button>
        {this.state.loading && <Loader />}
      </div>
    );
  }
}

export default SearchBar;
