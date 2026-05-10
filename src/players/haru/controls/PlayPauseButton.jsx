import styles from './PlayPauseButton.module.css';

export default function PlayPauseButton({ isPlaying, isEnded, onClick }) {
  const label = isEnded ? '다시 재생' : isPlaying ? '일시정지' : '재생';

  return (
    <button className={styles.btn} type="button" onClick={onClick} title={`${label} (K)`} aria-label={label}>
      {isEnded ? (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      ) : isPlaying ? (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
