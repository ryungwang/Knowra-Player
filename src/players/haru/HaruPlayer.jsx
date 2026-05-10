import { useCallback, useEffect, useRef, useState } from 'react';
import { useFullscreen } from '../../core/useFullscreen';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import { useKeyboardPlugin } from '../../plugins/keyboardPlugin';

import VideoScreen from '../base/VideoScreen';
import LoadingOverlay from '../base/overlays/LoadingOverlay';
import CenterPlayOverlay from '../base/overlays/CenterPlayOverlay';
import ErrorOverlay from '../base/overlays/ErrorOverlay';
import PlayerControls from './controls/PlayerControls';

import styles from './HaruPlayer.module.css';

export default function HaruPlayer({
  src,
  sources,
  title,
  poster,
  autoPlay = false,
  theaterMode = false,
  className = '',
  style,
  videoProps,
  onToggleTheater,
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
}) {
  const containerRef = useRef(null);
  const hideTimer = useRef(null);
  const clickTimer = useRef(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [overlay, setOverlay] = useState({ trigger: 0, type: 'play', label: '', side: 'center' });

  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    playbackRate,
    isLoading,
    error,
    isEnded,
    isLooping,
    isPip,
    play,
    togglePlay,
    seek,
    skip,
    changeVolume,
    toggleMute,
    changePlaybackRate,
    toggleLoop,
    togglePictureInPicture,
  } = useVideoPlayer({
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
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const sourceKey = sources?.map((source) => `${source.src}:${source.type ?? ''}`).join('|') || src || '';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceKey) return;
    video.load();
    if (autoPlay) play();
  }, [autoPlay, play, sourceKey, videoRef]);

  const triggerOverlay = useCallback((type, label = '', side = 'center') => {
    setOverlay((current) => ({
      trigger: current.trigger + 1,
      type,
      label,
      side,
    }));
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(clickTimer.current);
    };
  }, [isPlaying]);

  const handleTogglePlay = useCallback(() => {
    togglePlay();
    triggerOverlay(isPlaying ? 'pause' : 'play');
  }, [isPlaying, togglePlay, triggerOverlay]);

  const handleSkip = useCallback((seconds) => {
    skip(seconds);
    triggerOverlay(seconds > 0 ? 'forward' : 'backward', `${Math.abs(seconds)}초`, seconds > 0 ? 'right' : 'left');
  }, [skip, triggerOverlay]);

  const handleContainerClick = useCallback((e) => {
    if (e.target.closest('[data-controls]')) return;
    if (e.detail > 1) return;
    containerRef.current?.focus();
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(handleTogglePlay, 180);
  }, [handleTogglePlay]);

  const handleDoubleClick = useCallback((e) => {
    if (e.target.closest('[data-controls]')) return;
    e.preventDefault();
    clearTimeout(clickTimer.current);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = (e.clientX - rect.left) / rect.width;
    if (position < 0.35) {
      handleSkip(-10);
      return;
    }
    if (position > 0.65) {
      handleSkip(10);
      return;
    }

    toggleFullscreen();
    triggerOverlay('fullscreen');
  }, [handleSkip, toggleFullscreen, triggerOverlay]);

  useKeyboardPlugin({
    togglePlay: handleTogglePlay,
    seek,
    skip: handleSkip,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    currentTime,
    volume,
    isActive: isFocused,
  });

  const shouldShowControls = controlsVisible || !isPlaying || isLoading || error;

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${theaterMode ? styles.theater : ''} ${isFullscreen ? styles.fullscreen : ''} ${!shouldShowControls && isPlaying ? styles.hideCursor : ''} ${className}`}
      style={style}
      onMouseMove={showControls}
      onMouseEnter={() => {
        showControls();
        setIsFocused(true);
      }}
      onMouseLeave={() => setIsFocused(false)}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="region"
      aria-label={title ? `${title} 비디오 플레이어` : '비디오 플레이어'}
    >
      <VideoScreen
        videoRef={videoRef}
        src={src}
        sources={sources}
        poster={poster}
        loop={isLooping}
        videoProps={videoProps}
      />

      <div className={`${styles.scrimTop} ${shouldShowControls ? styles.visible : ''}`} />
      {title && (
        <div className={`${styles.titleBar} ${shouldShowControls ? styles.visible : ''}`}>
          <span className={styles.title}>{title}</span>
          <span className={styles.badge}>HD</span>
        </div>
      )}

      <CenterPlayOverlay
        isPlaying={isPlaying}
        trigger={overlay.trigger}
        type={overlay.type}
        label={overlay.label}
        side={overlay.side}
      />

      {isLoading && <LoadingOverlay />}
      {error && <ErrorOverlay message={error} />}

      <div
        data-controls
        className={`${styles.controlsWrapper} ${shouldShowControls ? styles.visible : ''}`}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <PlayerControls
          isPlaying={isPlaying}
          isEnded={isEnded}
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isLooping={isLooping}
          isPip={isPip}
          theaterMode={theaterMode}
          onTogglePlay={handleTogglePlay}
          onSeek={seek}
          onSkipBackward={() => handleSkip(-10)}
          onSkipForward={() => handleSkip(10)}
          onVolumeChange={changeVolume}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onChangePlaybackRate={changePlaybackRate}
          onToggleLoop={toggleLoop}
          onTogglePip={togglePictureInPicture}
          onToggleTheater={onToggleTheater}
        />
      </div>
    </div>
  );
}
