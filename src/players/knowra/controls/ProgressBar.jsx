import { useRef, useState, useCallback } from 'react';
import { formatTimeFromPercent } from '../../../core/formatTime';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ currentTime, duration, buffered, onSeek }) {
  const barRef = useRef(null);
  const [hoverPercent, setHoverPercent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const getPercent = useCallback((e) => {
    const bar = barRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  const handleMouseMove = (e) => {
    setHoverPercent(getPercent(e));
    if (isDragging) onSeek(getPercent(e) * duration);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    onSeek(getPercent(e) * duration);
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      onSeek(getPercent(e) * duration);
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    setHoverPercent(null);
    setIsDragging(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={barRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role="slider"
      aria-label="진행 상태"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.track}>
        {/* 버퍼 바 */}
        <div className={styles.buffered} style={{ width: `${bufferedPercent}%` }} />
        {/* 재생 진행 바 */}
        <div className={styles.progress} style={{ width: `${progress}%` }}>
          <div className={styles.thumb} />
        </div>
        {/* 호버 미리보기 라인 */}
        {hoverPercent !== null && (
          <div className={styles.hoverLine} style={{ width: `${hoverPercent * 100}%` }} />
        )}
      </div>
      {/* 호버 시간 툴팁 */}
      {hoverPercent !== null && duration > 0 && (
        <div
          className={styles.tooltip}
          style={{ left: `${hoverPercent * 100}%` }}
        >
          {formatTimeFromPercent(hoverPercent, duration)}
        </div>
      )}
    </div>
  );
}
