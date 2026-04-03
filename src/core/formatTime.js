/**
 * 초(seconds)를 HH:MM:SS 또는 MM:SS 형식으로 변환
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * 퍼센트(0~1)를 "HH:MM:SS" 형식으로 변환 (progress bar 툴팁용)
 */
export function formatTimeFromPercent(percent, duration) {
  return formatTime(percent * duration);
}
