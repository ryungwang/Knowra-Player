import { useRef, useState, useCallback, useEffect } from 'react';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import { formatTime } from '../../core/formatTime';
import LoadingOverlay from '../base/overlays/LoadingOverlay';
import ErrorOverlay from '../base/overlays/ErrorOverlay';
import styles from './PostPlayer.module.css';

/**
 * PostPlayer - 카드형 인라인 플레이어
 * - 최소 컨트롤: 재생/정지 + 진행바만
 * - mutedByDefault prop
 * - hover 시 컨트롤 표시
 */
export default function PostPlayer({
  src,
  poster,
  title,
  mutedByDefault = false,
  autoPlay = false,
}) {
  const player = useVideoPlayer();
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimer = useRef(null);

  // src 변경 시 리로드
  useEffect(() => {
    const video = player.videoRef.current;
    if (!video || !src) return;
    video.load();
    if (mutedByDefault) video.muted = true;
    if (autoPlay) video.play().catch(() => {});
  }, [src, autoPlay, mutedByDefault]);

  const handleTogglePlay = useCallback(() => {
    player.togglePlay();
  }, [player]);

  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    player.seek(pct * player.duration);
  }, [player]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (player.isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 2500);
    }
  }, [player.isPlaying]);

  useEffect(() => {
    if (!player.isPlaying) {
      setControlsVisible(true);
      clearTimeout(hideTimer.current);
    }
    return () => clearTimeout(hideTimer.current);
  }, [player.isPlaying]);

  const progress = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;

  return (
    <div
      className={styles.container}
      onMouseEnter={showControls}
      onMouseMove={showControls}
      onMouseLeave={() => {
        if (player.isPlaying) setControlsVisible(false);
      }}
    >
      {/* 비디오 */}
      <video
        ref={player.videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        playsInline
        muted={mutedByDefault}
        onClick={handleTogglePlay}
      />

      {/* 로딩 */}
      {player.isLoading && <LoadingOverlay />}

      {/* 오류 */}
      {player.error && <ErrorOverlay message={player.error} />}

      {/* 컨트롤 오버레이 */}
      <div className={`${styles.controls} ${controlsVisible ? styles.visible : ''}`}>
        {/* 재생/정지 버튼 */}
        <button
          className={styles.playBtn}
          onClick={handleTogglePlay}
          aria-label={player.isPlaying ? '일시정지' : '재생'}
        >
          {player.isPlaying ? (
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* 진행 바 */}
        <div
          className={styles.progressBar}
          onClick={handleSeek}
          role="slider"
          aria-label="진행 상태"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* 시간 표시 */}
        <span className={styles.time}>
          {formatTime(player.currentTime)} / {formatTime(player.duration)}
        </span>
      </div>

      {/* 제목 */}
      {title && (
        <div className={`${styles.titleBar} ${controlsVisible ? styles.visible : ''}`}>
          <span className={styles.title}>{title}</span>
        </div>
      )}
    </div>
  );
}
