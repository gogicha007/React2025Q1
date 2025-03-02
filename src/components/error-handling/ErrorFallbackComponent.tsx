import styles from '../../../styles/ErrorFallback.module.css';

const ErrorFallback = () => {
  return (
    <div className={styles.error_fallback} role="alert">
      <h1>An error was thrown</h1>
      <h2>Something went wrong...</h2>
    </div>
  );
};

export default ErrorFallback;
