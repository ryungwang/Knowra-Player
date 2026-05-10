import { useEffect } from 'react';

export function useKeyboardPlugin({
  togglePlay,
  seek,
  skip,
  changeVolume,
  toggleMute,
  toggleFullscreen,
  togglePictureInPicture,
  currentTime,
  volume,
  isActive,
}) {
  useEffect(() => {
    if (!isActive) return undefined;

    const handler = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          if (skip) skip(-10);
          else seek(currentTime - 10);
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          if (skip) skip(10);
          else seek(currentTime + 10);
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
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyI':
          e.preventDefault();
          togglePictureInPicture?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    togglePlay,
    seek,
    skip,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    currentTime,
    volume,
    isActive,
  ]);
}
