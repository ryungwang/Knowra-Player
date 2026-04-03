import styles from './VideoScreen.module.css';

export default function VideoScreen({ videoRef, src, poster, onTogglePlay }) {
  return (
    <video
      ref={videoRef}
      className={styles.video}
      src={src}
      poster={poster}
      onClick={onTogglePlay}
      onDoubleClick={(e) => e.stopPropagation()}
      playsInline
    />
  );
}
