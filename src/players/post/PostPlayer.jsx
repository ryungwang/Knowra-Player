import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCount } from '../../core/formatCount';
import { formatTime } from '../../core/formatTime';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import ErrorOverlay from '../base/overlays/ErrorOverlay';
import LoadingOverlay from '../base/overlays/LoadingOverlay';
import styles from './PostPlayer.module.css';

function IconButton({ active = false, label, onClick, children }) {
  return (
    <button
      className={`${styles.iconBtn} ${active ? styles.active : ''}`}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
    >
      {children}
    </button>
  );
}

function PlayIcon({ playing }) {
  if (playing) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="25" height="25" aria-hidden="true">
      <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="25" height="25" aria-hidden="true">
      <path d="M21 6.5A4.5 4.5 0 0 0 16.5 2h-9A4.5 4.5 0 0 0 3 6.5v5A4.5 4.5 0 0 0 7.5 16H8v4.25c0 .6.71.91 1.15.5L14.2 16h2.3A4.5 4.5 0 0 0 21 11.5v-5z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="25" height="25" aria-hidden="true">
      <path d="M2 21 23 3l-6.1 18.4-5.1-7.5L2 21zm9.5-8.9 4.1 6.1 3.3-10-7.4 3.9z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="25" height="25" aria-hidden="true">
      <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function VolumeIcon({ muted }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

export default function PostPlayer({
  src,
  sources,
  poster,
  title,
  author = 'haru.media',
  avatar,
  location = 'Community',
  caption,
  likes = 8420,
  comments = 214,
  mutedByDefault = false,
  autoPlay = false,
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
  onComment,
  onShare,
  onMore,
}) {
  const hideTimer = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    play,
    togglePlay,
    seek,
    toggleMute,
  } = useVideoPlayer({
    defaultMuted: mutedByDefault,
    defaultVolume: mutedByDefault ? 0 : 0.9,
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
  const sourceKey = sources?.map((source) => `${source.src}:${source.type ?? ''}`).join('|') || src || '';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceKey) return;
    video.load();
    if (autoPlay) play();
  }, [autoPlay, play, sourceKey, videoRef]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 2200);
    }
  }, [isPlaying]);

  useEffect(() => {
    clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 2200);
    }
    return () => clearTimeout(hideTimer.current);
  }, [isPlaying]);

  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    seek(pct * duration);
  }, [duration, seek]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const shouldShowControls = controlsVisible || !isPlaying || isLoading || error;
  const displayCaption = caption || title;

  return (
    <article className={`${styles.card} ${className}`} style={style}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {avatar ? <img src={avatar} alt="" /> : <span>{author.slice(0, 1).toUpperCase()}</span>}
        </div>
        <div className={styles.profile}>
          <strong>{author}</strong>
          <span>{location}</span>
        </div>
        <button className={styles.moreBtn} type="button" aria-label="더보기" title="더보기" onClick={onMore}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="21" height="21" aria-hidden="true">
            <path d="M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>
      </header>

      <div
        className={styles.media}
        onMouseEnter={showControls}
        onMouseMove={showControls}
        onMouseLeave={() => {
          if (isPlaying) setControlsVisible(false);
        }}
        onClick={togglePlay}
      >
        <video
          {...videoProps}
          ref={videoRef}
          className={styles.video}
          src={sources?.length ? undefined : src}
          poster={poster}
          playsInline
          muted={isMuted}
          preload="metadata"
        >
          {sources?.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>

        {isLoading && <LoadingOverlay />}
        {error && <ErrorOverlay message={error} />}

        <div
          className={`${styles.videoControls} ${shouldShowControls ? styles.visible : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.playBtn}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? '일시정지' : '재생'}
            title={isPlaying ? '일시정지' : '재생'}
          >
            <PlayIcon playing={isPlaying} />
          </button>

          <button
            className={styles.playBtn}
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

          <div className={styles.progressBar} role="slider" aria-label="진행 상태" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} onClick={handleSeek}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <span className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.actionRow}>
          <div className={styles.leftActions}>
            <IconButton
              active={liked}
              label="좋아요"
              onClick={() => setLiked((value) => {
                const next = !value;
                onLikeChange?.(next);
                return next;
              })}
            >
              <HeartIcon />
            </IconButton>
            <IconButton label="댓글" onClick={onComment}>
              <CommentIcon />
            </IconButton>
            <IconButton label="공유" onClick={onShare}>
              <ShareIcon />
            </IconButton>
          </div>
          <IconButton
            active={saved}
            label="저장"
            onClick={() => setSaved((value) => {
              const next = !value;
              onSaveChange?.(next);
              return next;
            })}
          >
            <BookmarkIcon />
          </IconButton>
        </div>

        <strong className={styles.likes}>좋아요 {formatCount(likes + (liked ? 1 : 0))}개</strong>
        {displayCaption && (
          <p className={styles.caption}>
            <strong>{author}</strong> {displayCaption}
          </p>
        )}
        <button className={styles.commentLink} type="button">댓글 {formatCount(comments)}개 모두 보기</button>
        <div className={styles.volumeMeter} aria-hidden="true">
          <span style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
        </div>
      </div>
    </article>
  );
}
