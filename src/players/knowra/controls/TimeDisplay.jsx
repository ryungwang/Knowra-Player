import { formatTime } from '../../../core/formatTime';
import styles from './TimeDisplay.module.css';

export default function TimeDisplay({ currentTime, duration }) {
  return (
    <div className={styles.display}>
      <span className={styles.current}>{formatTime(currentTime)}</span>
      <span className={styles.separator}>/</span>
      <span className={styles.total}>{formatTime(duration)}</span>
    </div>
  );
}
