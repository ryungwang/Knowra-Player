import styles from './ErrorOverlay.module.css';

export default function ErrorOverlay({ message }) {
  return (
    <div className={styles.overlay}>
      <svg viewBox="0 0 24 24" fill="#f44336" width="48" height="48" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <p className={styles.message}>{message || '영상을 불러오지 못했습니다.'}</p>
    </div>
  );
}
