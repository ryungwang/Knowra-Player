import { useEffect, useState } from 'react';
import styles from './CenterPlayOverlay.module.css';

/**
 * 클릭 시 중앙에 재생/일시정지 아이콘을 잠깐 표시하는 오버레이
 */
export default function CenterPlayOverlay({ isPlaying, trigger }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.icon}>
        {isPlaying ? (
          // 재생 중 → 재생 아이콘 표시 (방금 재생 시작했을 때)
          <svg viewBox="0 0 24 24" fill="white" width="64" height="64">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          // 일시정지 → 멈춤 아이콘 표시
          <svg viewBox="0 0 24 24" fill="white" width="64" height="64">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </div>
    </div>
  );
}
