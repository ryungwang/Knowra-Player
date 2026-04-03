import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver 기반 자동재생 훅
 * 화면에 진입하면 play(), 이탈하면 pause()
 *
 * @param {React.RefObject} videoRef - video 요소 ref
 * @param {{ enabled?: boolean, threshold?: number }} options
 */
export function useAutoPlayOnView(videoRef, { enabled = true, threshold = 0.6 } = {}) {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    // 모바일 자동재생 정책을 위해 muted 강제
    video.muted = true;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold }
    );

    observerRef.current.observe(video);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [videoRef, enabled, threshold]);
}
