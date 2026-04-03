import styles from './VolumeControl.module.css';

export default function VolumeControl({ volume, isMuted, onToggleMute, onVolumeChange }) {
  const displayVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (isMuted || displayVolume === 0) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      );
    }
    if (displayVolume < 0.5) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    );
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.muteBtn}
        onClick={onToggleMute}
        title={isMuted ? '음소거 해제 (M)' : '음소거 (M)'}
        aria-label={isMuted ? '음소거 해제' : '음소거'}
      >
        {getVolumeIcon()}
      </button>
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          className={styles.slider}
          min="0"
          max="1"
          step="0.01"
          value={displayVolume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="볼륨"
          style={{ '--volume': `${displayVolume * 100}%` }}
        />
      </div>
    </div>
  );
}
