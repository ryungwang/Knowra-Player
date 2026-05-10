import styles from './CenterPlayOverlay.module.css';

function OverlayIcon({ type }) {
  if (type === 'forward') {
    return (
      <svg viewBox="0 0 24 24" fill="white" width="42" height="42" aria-hidden="true">
        <path d="M5 5v14l8-7-8-7zm9 0v14l8-7-8-7z" />
      </svg>
    );
  }

  if (type === 'backward') {
    return (
      <svg viewBox="0 0 24 24" fill="white" width="42" height="42" aria-hidden="true">
        <path d="M10 5v14l-8-7 8-7zm9 0v14l-8-7 8-7z" />
      </svg>
    );
  }

  if (type === 'fullscreen') {
    return (
      <svg viewBox="0 0 24 24" fill="white" width="42" height="42" aria-hidden="true">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
      </svg>
    );
  }

  if (type === 'pause') {
    return (
      <svg viewBox="0 0 24 24" fill="white" width="52" height="52" aria-hidden="true">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="white" width="52" height="52" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function CenterPlayOverlay({
  isPlaying,
  trigger,
  type,
  label,
  side = 'center',
}) {
  if (trigger === 0) return null;

  const resolvedType = type || (isPlaying ? 'play' : 'pause');

  return (
    <div key={trigger} className={`${styles.overlay} ${styles[side] || styles.center}`}>
      <div className={styles.icon}>
        <OverlayIcon type={resolvedType} />
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
