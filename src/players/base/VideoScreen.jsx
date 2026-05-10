import styles from './VideoScreen.module.css';

export default function VideoScreen({ videoRef, src, sources, poster, loop = false, videoProps }) {
  return (
    <video
      {...videoProps}
      ref={videoRef}
      className={styles.video}
      src={sources?.length ? undefined : src}
      poster={poster}
      loop={loop}
      playsInline
      preload="metadata"
      draggable="false"
    >
      {sources?.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
