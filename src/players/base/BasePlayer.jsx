import { useRef, useEffect } from 'react';
import { useVideoPlayer } from '../../core/useVideoPlayer';
import { useFullscreen } from '../../core/useFullscreen';

/**
 * BasePlayer - render props 패턴
 *
 * useVideoPlayer + useFullscreen 을 조합하여 player 객체를 구성하고,
 * children이 함수면 player 객체를 전달한다.
 *
 * @param {{ src: string, autoPlay?: boolean, children: Function | React.ReactNode }} props
 */
export default function BasePlayer({ src, autoPlay = false, children }) {
  const containerRef = useRef(null);
  const player = useVideoPlayer();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // src 변경 시 video.load() 호출
  useEffect(() => {
    const video = player.videoRef.current;
    if (!video || !src) return;
    video.load();
    if (autoPlay) video.play().catch(() => {});
  }, [src, autoPlay]);

  const playerObj = {
    ...player,
    containerRef,
    isFullscreen,
    toggleFullscreen,
  };

  if (typeof children === 'function') {
    return children(playerObj);
  }

  return children;
}
