import styles from './results.module.css';
import { IFCharacter } from '../../types/interface';
import { Card } from '../card/card';

const Results = ({ data }: { data: IFCharacter[] }) => {
  return (
    <div className={styles.results}>
      <div className={styles.results__list}>
        {data.map((obj: IFCharacter, id) => {
          return <Card {...obj} key={id} />;
        })}
      </div>
    </div>
  );
};

export default Results;
