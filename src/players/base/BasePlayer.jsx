import { useEffect, useMemo, useRef } from 'react';
import { useFullscreen } from '../../core/useFullscreen';
import { useVideoPlayer } from '../../core/useVideoPlayer';

export default function BasePlayer({ src, autoPlay = false, children }) {
  const containerRef = useRef(null);
  const player = useVideoPlayer();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { play, videoRef } = player;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    video.load();
    if (autoPlay) play();
  }, [autoPlay, play, src, videoRef]);

  const playerObj = useMemo(() => ({
    ...player,
    containerRef,
    isFullscreen,
    toggleFullscreen,
  }), [isFullscreen, player, toggleFullscreen]);

  if (typeof children === 'function') {
    // eslint-disable-next-line react-hooks/refs
    return children(playerObj);
  }

  return children;
}
