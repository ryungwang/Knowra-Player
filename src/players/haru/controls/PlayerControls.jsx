import PlayPauseButton from './PlayPauseButton';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';
import TimeDisplay from './TimeDisplay';
import FullscreenButton from './FullscreenButton';
import SettingsMenu from './SettingsMenu';
import styles from './PlayerControls.module.css';

function ControlButton({ active = false, label, onClick, children }) {
  return (
    <button
      className={`${styles.iconButton} ${active ? styles.active : ''}`}
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
    >
      {children}
    </button>
  );
}

function SkipBackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M11 7V3L4 8l7 5V9c3.31 0 6 2.69 6 6 0 1.6-.62 3.1-1.76 4.24l1.42 1.42A7.96 7.96 0 0 0 19 15c0-4.42-3.58-8-8-8z" />
      <path d="M7.5 14.75h1.25V19h1.5v-6H8.9l-1.4 1.05v.7zm5.75 4.4c1.45 0 2.35-1.1 2.35-3.1s-.9-3.1-2.35-3.1-2.35 1.1-2.35 3.1.9 3.1 2.35 3.1zm0-1.25c-.55 0-.82-.58-.82-1.85 0-1.26.27-1.84.82-1.84s.82.58.82 1.84c0 1.27-.27 1.85-.82 1.85z" />
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M13 7V3l7 5-7 5V9c-3.31 0-6 2.69-6 6 0 1.6.62 3.1 1.76 4.24l-1.42 1.42A7.96 7.96 0 0 1 5 15c0-4.42 3.58-8 8-8z" />
      <path d="M8.4 14.75h1.25V19h1.5v-6H9.8l-1.4 1.05v.7zm5.75 4.4c1.45 0 2.35-1.1 2.35-3.1s-.9-3.1-2.35-3.1-2.35 1.1-2.35 3.1.9 3.1 2.35 3.1zm0-1.25c-.55 0-.82-.58-.82-1.85 0-1.26.27-1.84.82-1.84s.82.58.82 1.84c0 1.27-.27 1.85-.82 1.85z" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M7 7h8.17l-2.59-2.59L14 3l5 5-5 5-1.42-1.41L15.17 9H7c-1.66 0-3 1.34-3 3 0 .82.33 1.57.88 2.12L3.46 15.54A4.98 4.98 0 0 1 2 12c0-2.76 2.24-5 5-5zm10 10H8.83l2.59 2.59L10 21l-5-5 5-5 1.42 1.41L8.83 15H17c1.66 0 3-1.34 3-3 0-.82-.33-1.57-.88-2.12l1.42-1.42A4.98 4.98 0 0 1 22 12c0 2.76-2.24 5-5 5z" />
    </svg>
  );
}

function TheaterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm3 2h8v6H8V9z" />
    </svg>
  );
}

function PipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M19 7H5v10h14V7zm2-2v14H3V5h18zm-4 7h-6v4h6v-4z" />
    </svg>
  );
}

export default function PlayerControls({
  isPlaying,
  isEnded,
  currentTime,
  duration,
  buffered,
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  isLooping,
  isPip,
  theaterMode,
  onTogglePlay,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onChangePlaybackRate,
  onToggleLoop,
  onTogglePip,
  onToggleTheater,
}) {
  return (
    <div className={styles.controls}>
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        buffered={buffered}
        onSeek={onSeek}
      />
      <div className={styles.bar}>
        <div className={styles.left}>
          <PlayPauseButton
            isPlaying={isPlaying}
            isEnded={isEnded}
            onClick={onTogglePlay}
          />
          <ControlButton label="10초 뒤로" onClick={onSkipBackward}>
            <SkipBackIcon />
          </ControlButton>
          <ControlButton label="10초 앞으로" onClick={onSkipForward}>
            <SkipForwardIcon />
          </ControlButton>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />
          <TimeDisplay currentTime={currentTime} duration={duration} />
        </div>
        <div className={styles.right}>
          <ControlButton active={isLooping} label="반복 재생" onClick={onToggleLoop}>
            <LoopIcon />
          </ControlButton>
          <SettingsMenu
            playbackRate={playbackRate}
            onChangePlaybackRate={onChangePlaybackRate}
          />
          {onToggleTheater && (
            <ControlButton active={theaterMode} label="극장 모드" onClick={onToggleTheater}>
              <TheaterIcon />
            </ControlButton>
          )}
          <ControlButton active={isPip} label="미니 플레이어" onClick={onTogglePip}>
            <PipIcon />
          </ControlButton>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
        </div>
      </div>
    </div>
  );
}
