import styles from './PlayPauseButton.module.css';

export default function PlayPauseButton({ isPlaying, isEnded, onClick }) {
  return (
    <button className={styles.btn} onClick={onClick} title={isPlaying ? '일시정지 (K)' : '재생 (K)'} aria-label={isPlaying ? '일시정지' : '재생'}>
      {isEnded ? (
        // 다시 재생 아이콘
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      ) : isPlaying ? (
        // 일시정지 아이콘
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        // 재생 아이콘
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
