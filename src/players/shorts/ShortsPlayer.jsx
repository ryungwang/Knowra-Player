import { useCallback, useEffect, useState } from 'react';
import { formatCount } from '../../core/formatCount';
import { useAutoPlayOnView } from '../../core/useAutoPlayOnView';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import CenterPlayOverlay from '../base/overlays/CenterPlayOverlay';
import ErrorOverlay from '../base/overlays/ErrorOverlay';
import LoadingOverlay from '../base/overlays/LoadingOverlay';
import styles from './ShortsPlayer.module.css';

function ActionButton({ active = false, label, count, onClick, children }) {
  return (
    <button
      className={`${styles.actionBtn} ${active ? styles.actionActive : ''}`}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={label}
      aria-pressed={active || undefined}
      title={label}
    >
      <span className={styles.actionIcon}>{children}</span>
      {count !== undefined && <span className={styles.actionLabel}>{formatCount(count)}</span>}
    </button>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
      <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
      <path d="M21 6.5A4.5 4.5 0 0 0 16.5 2h-9A4.5 4.5 0 0 0 3 6.5v5A4.5 4.5 0 0 0 7.5 16H8v4.25c0 .6.71.91 1.15.5L14.2 16h2.3A4.5 4.5 0 0 0 21 11.5v-5z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.3 3.3 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 15 5c0 .24.04.47.09.7L8.04 9.81a3 3 0 1 0 0 4.38l7.12 4.17c-.05.2-.08.42-.08.64a2.92 2.92 0 1 0 2.92-2.92z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
      <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function VolumeIcon({ muted }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export default function ShortsPlayer({
  src,
  sources,
  poster,
  title,
  author = 'haru.creator',
  avatar,
  caption,
  likes = 28400,
  comments = 1260,
  shares = 884,
  loop = true,
  autoPlayOnView = true,
  className = '',
  style,
  videoProps,
  onPlay,
  onPause,
  onEnded,
  onWaiting,
  onCanPlay,
  onTimeUpdate,
  onDurationChange,
  onProgress,
  onVolumeChange,
  onRateChange,
  onError,
  onLikeChange,
  onSaveChange,
  onFollowChange,
  onComment,
  onShare,
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [overlay, setOverlay] = useState({ trigger: 0, type: 'play' });

  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    isLoading,
    error,
    togglePlay,
    toggleMute,
  } = useVideoPlayer({
    defaultMuted: true,
    defaultVolume: 0.85,
    onPlay,
    onPause,
    onEnded,
    onWaiting,
    onCanPlay,
    onTimeUpdate,
    onDurationChange,
    onProgress,
    onVolumeChange,
    onRateChange,
    onError,
  });

  useAutoPlayOnView(videoRef, {
    enabled: autoPlayOnView,
    threshold: 0.65,
    muted: true,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = loop;
  }, [loop, videoRef]);

  const triggerOverlay = useCallback((type) => {
    setOverlay((current) => ({ trigger: current.trigger + 1, type }));
  }, []);

  const handleTogglePlay = useCallback(() => {
    togglePlay();
    triggerOverlay(isPlaying ? 'pause' : 'play');
  }, [isPlaying, togglePlay, triggerOverlay]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayCaption = caption || title;

  return (
    <article
      className={`${styles.container} ${className}`}
      style={style}
      onClick={handleTogglePlay}
    >
      <video
        {...videoProps}
        ref={videoRef}
        className={styles.video}
        src={sources?.length ? undefined : src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        playsInline
        preload="metadata"
      >
        {sources?.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      <div className={styles.topShade} />
      <div className={styles.bottomShade} />

      {isLoading && <LoadingOverlay />}
      {error && <ErrorOverlay message={error} />}
      <CenterPlayOverlay isPlaying={isPlaying} trigger={overlay.trigger} type={overlay.type} />

      <div className={styles.progressBar} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <button
        className={styles.muteBtn}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        aria-label={isMuted ? '소리 켜기' : '음소거'}
        title={isMuted ? '소리 켜기' : '음소거'}
      >
        <VolumeIcon muted={isMuted} />
      </button>

      <div className={styles.actions}>
        <ActionButton
          active={liked}
          label="좋아요"
          count={likes + (liked ? 1 : 0)}
          onClick={() => setLiked((value) => {
            const next = !value;
            onLikeChange?.(next);
            return next;
          })}
        >
          <HeartIcon />
        </ActionButton>
        <ActionButton label="댓글" count={comments} onClick={onComment}>
          <CommentIcon />
        </ActionButton>
        <ActionButton label="공유" count={shares} onClick={onShare}>
          <ShareIcon />
        </ActionButton>
        <ActionButton
          active={saved}
          label="저장"
          onClick={() => setSaved((value) => {
            const next = !value;
            onSaveChange?.(next);
            return next;
          })}
        >
          <BookmarkIcon />
        </ActionButton>
      </div>

      <div className={styles.meta}>
        <div className={styles.authorRow}>
          <div className={styles.avatar}>
            {avatar ? <img src={avatar} alt="" /> : <span>{author.slice(0, 1).toUpperCase()}</span>}
          </div>
          <strong className={styles.author}>@{author}</strong>
          <button
            className={`${styles.followBtn} ${followed ? styles.followed : ''}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFollowed((value) => {
                const next = !value;
                onFollowChange?.(next);
                return next;
              });
            }}
          >
            {followed ? '팔로잉' : '팔로우'}
          </button>
        </div>
        {displayCaption && <p className={styles.caption}>{displayCaption}</p>}
      </div>
    </article>
  );
}
