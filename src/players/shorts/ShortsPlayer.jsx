import { useRef, useCallback, useState } from 'react';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import { useAutoPlayOnView } from '../../core/useAutoPlayOnView';
import LoadingOverlay from '../base/overlays/LoadingOverlay';
import ErrorOverlay from '../base/overlays/ErrorOverlay';
import styles from './ShortsPlayer.module.css';

/**
 * ShortsPlayer - 9:16 세로형 짧은 영상 플레이어
 * - useAutoPlayOnView: 화면에 보일 때 자동재생
 * - videoRegistry 연동 (useVideoPlayer 내부에서 처리)
 * - loop prop 지원
 * - muted 기본값
 * - 우측 액션 버튼 영역 (좋아요/댓글 - UI만)
 */
export default function ShortsPlayer({
  src,
  poster,
  title,
  loop = true,
  autoPlayOnView = true,
}) {
  const player = useVideoPlayer();
  const [showControls, setShowControls] = useState(false);

  // useAutoPlayOnView에서 videoRef를 직접 사용
  useAutoPlayOnView(player.videoRef, { enabled: autoPlayOnView, threshold: 0.6 });

  const handleTogglePlay = useCallback(() => {
    player.togglePlay();
  }, [player]);

  const progress = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 비디오 */}
      <video
        ref={player.videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        loop={loop}
        muted
        playsInline
        onClick={handleTogglePlay}
      />

      {/* 로딩 */}
      {player.isLoading && <LoadingOverlay />}

      {/* 오류 */}
      {player.error && <ErrorOverlay message={player.error} />}

      {/* 하단 진행 바 */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* 중앙 재생/정지 버튼 오버레이 (hover 시) */}
      {showControls && (
        <button
          className={styles.playBtn}
          onClick={handleTogglePlay}
          aria-label={player.isPlaying ? '일시정지' : '재생'}
        >
          {player.isPlaying ? (
            <svg viewBox="0 0 24 24" fill="white" width="36" height="36">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" width="36" height="36">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* 우측 액션 버튼 영역 (UI만, 기능 없음) */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} aria-label="좋아요" title="좋아요">
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          </svg>
          <span className={styles.actionLabel}>좋아요</span>
        </button>

        <button className={styles.actionBtn} aria-label="댓글" title="댓글">
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
          </svg>
          <span className={styles.actionLabel}>댓글</span>
        </button>

        <button className={styles.actionBtn} aria-label="공유" title="공유">
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
          </svg>
          <span className={styles.actionLabel}>공유</span>
        </button>
      </div>

      {/* 하단 제목 */}
      {title && (
        <div className={styles.titleArea}>
          <p className={styles.title}>{title}</p>
        </div>
      )}
    </div>
  );
}
