import { formatTime } from '../core/formatTime';
import styles from './PlaylistItem.module.css';

export default function PlaylistItem({ item, index, isActive, onClick }) {
  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={() => onClick(index)}
      aria-label={`${item.title} 재생`}
      aria-current={isActive ? 'true' : undefined}
    >
      <div className={styles.thumbnail}>
        {item.poster ? (
          <img src={item.poster} alt="" className={styles.thumb} />
        ) : (
          <div className={styles.thumbPlaceholder}>
            <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)" width="24" height="24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        {item.duration && (
          <span className={styles.duration}>{formatTime(item.duration)}</span>
        )}
        {isActive && (
          <div className={styles.activeIndicator}>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{item.title}</span>
        {item.subtitle && <span className={styles.subtitle}>{item.subtitle}</span>}
      </div>
    </button>
  );
}
