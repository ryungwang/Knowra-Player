import { useRef, useState, useCallback, useEffect } from 'react';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import { useFullscreen } from '../../core/useFullscreen';
import { useKeyboardPlugin } from '../../plugins/keyboardPlugin';

import VideoScreen from '../base/VideoScreen';
import PlayerControls from './controls/PlayerControls';
import LoadingOverlay from '../base/overlays/LoadingOverlay';
import CenterPlayOverlay from '../base/overlays/CenterPlayOverlay';
import ErrorOverlay from '../base/overlays/ErrorOverlay';

import styles from './KnowraPlayer.module.css';

export default function KnowraPlayer({ src, title, poster, autoPlay = false }) {
  const containerRef = useRef(null);
  const hideTimer = useRef(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [playTrigger, setPlayTrigger] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const player = useVideoPlayer();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // src가 변경되면 비디오 리로드
  useEffect(() => {
    const video = player.videoRef.current;
    if (!video || !src) return;
    video.load();
    if (autoPlay) video.play().catch(() => {});
  }, [src, autoPlay]);

  // 컨트롤 자동 숨김
  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (player.isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [player.isPlaying]);

  useEffect(() => {
    if (!player.isPlaying) {
      setControlsVisible(true);
      clearTimeout(hideTimer.current);
    } else {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
    return () => clearTimeout(hideTimer.current);
  }, [player.isPlaying]);

  const handleTogglePlay = useCallback(() => {
    player.togglePlay();
    setPlayTrigger((n) => n + 1);
  }, [player]);

  const handleContainerClick = useCallback((e) => {
    // 컨트롤 영역 클릭은 무시
    if (e.target.closest('[data-controls]')) return;
    handleTogglePlay();
  }, [handleTogglePlay]);

  const handleDoubleClick = useCallback((e) => {
    if (e.target.closest('[data-controls]')) return;
    toggleFullscreen();
  }, [toggleFullscreen]);

  useKeyboardPlugin({
    togglePlay: handleTogglePlay,
    seek: player.seek,
    changeVolume: player.changeVolume,
    toggleMute: player.toggleMute,
    toggleFullscreen,
    currentTime: player.currentTime,
    volume: player.volume,
    isActive: isFocused,
  });

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''} ${!controlsVisible && player.isPlaying ? styles.hideCursor : ''}`}
      onMouseMove={showControls}
      onMouseEnter={() => { showControls(); setIsFocused(true); }}
      onMouseLeave={() => setIsFocused(false)}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="region"
      aria-label={title ? `${title} 비디오 플레이어` : '비디오 플레이어'}
    >
      {/* 비디오 화면 */}
      <VideoScreen videoRef={player.videoRef} src={src} poster={poster} onTogglePlay={handleTogglePlay} />

      {/* 비디오 제목 */}
      {title && (
        <div className={`${styles.titleBar} ${controlsVisible ? styles.visible : ''}`}>
          <span className={styles.title}>{title}</span>
        </div>
      )}

      {/* 클릭 시 중앙 아이콘 */}
      <CenterPlayOverlay isPlaying={player.isPlaying} trigger={playTrigger} />

      {/* 로딩 스피너 */}
      {player.isLoading && <LoadingOverlay />}

      {/* 오류 */}
      {player.error && <ErrorOverlay message={player.error} />}

      {/* 컨트롤 바 */}
      <div
        data-controls
        className={`${styles.controlsWrapper} ${controlsVisible ? styles.visible : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <PlayerControls
          isPlaying={player.isPlaying}
          isEnded={player.isEnded}
          currentTime={player.currentTime}
          duration={player.duration}
          buffered={player.buffered}
          volume={player.volume}
          isMuted={player.isMuted}
          playbackRate={player.playbackRate}
          isFullscreen={isFullscreen}
          onTogglePlay={handleTogglePlay}
          onSeek={player.seek}
          onVolumeChange={player.changeVolume}
          onToggleMute={player.toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onChangePlaybackRate={player.changePlaybackRate}
        />
      </div>
    </div>
  );
}
