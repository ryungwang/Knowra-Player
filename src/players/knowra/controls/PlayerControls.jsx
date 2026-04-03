import PlayPauseButton from './PlayPauseButton';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';
import TimeDisplay from './TimeDisplay';
import FullscreenButton from './FullscreenButton';
import SettingsMenu from './SettingsMenu';
import styles from './PlayerControls.module.css';

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
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onChangePlaybackRate,
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
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />
          <TimeDisplay currentTime={currentTime} duration={duration} />
        </div>
        <div className={styles.right}>
          <SettingsMenu
            playbackRate={playbackRate}
            onChangePlaybackRate={onChangePlaybackRate}
          />
          <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
        </div>
      </div>
    </div>
  );
}
