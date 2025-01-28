import styles from './loader.module.css';
import { Component } from 'react';

class Loader extends Component {
  render() {
    return (
      <div className={styles.modal}>
        <div className={styles.loader}></div>
      </div>
    );
  }
}

export default Loader;
