import { useEffect, useRef } from 'react';

export function useAutoPlayOnView(
  videoRef,
  {
    enabled = true,
    threshold = 0.6,
    muted = true,
    pauseOnExit = true,
  } = {},
) {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = muted || video.muted;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          return;
        }

        if (pauseOnExit) {
          video.pause();
        }
      },
      { threshold },
    );

    observerRef.current.observe(video);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [videoRef, enabled, threshold, muted, pauseOnExit]);
}
