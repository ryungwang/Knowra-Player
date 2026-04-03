import { useEffect } from 'react';

/**
 * 플레이어 키보드 단축키 등록 플러그인
 *
 * Space / K  → 재생/일시정지
 * ←          → 5초 뒤로
 * →          → 5초 앞으로
 * ↑          → 볼륨 +10%
 * ↓          → 볼륨 -10%
 * M          → 음소거 토글
 * F          → 전체화면 토글
 */
export function useKeyboardPlugin({ togglePlay, seek, changeVolume, toggleMute, toggleFullscreen, currentTime, volume, isActive }) {
  useEffect(() => {
    if (!isActive) return;

    const handler = (e) => {
      // 입력 필드에서는 단축키 비활성화
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, seek, changeVolume, toggleMute, toggleFullscreen, currentTime, volume, isActive]);
}
