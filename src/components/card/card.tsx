import styles from './card.module.css';
import { IFCharacter } from '../../types/interface';

export const Card = (data: IFCharacter) => {
  return (
    <div className={styles.card}>
      <img className={styles.card__image} src={data.image} alt="" />
      <p className={styles.card__data}>{data.name}</p>
      <p className={styles.card__data}>{data.species}</p>
      <p className={styles.card__data}>{data.status}</p>
    </div>
  );
};
