import { useState, useRef, useCallback, useEffect } from 'react';
import { register, pauseOthers } from './videoRegistry';

/**
 * 비디오 플레이어의 핵심 상태와 제어 로직을 담당하는 커스텀 훅
 * videoRegistry와 연동하여 동시재생을 방지한다.
 */
export function useVideoPlayer() {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEnded, setIsEnded] = useState(false);

  // 재생 / 일시정지 토글
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch((err) => setError(err.message));
    } else {
      video.pause();
    }
  }, []);

  // 탐색 (seek)
  const seek = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  // 볼륨 변경
  const changeVolume = useCallback((value) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, value));
    video.volume = clamped;
    setVolume(clamped);
    if (clamped > 0) setIsMuted(false);
  }, []);

  // 음소거 토글
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // 재생 속도 변경
  const changePlaybackRate = useCallback((rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  // pause 함수 (registry에 등록용)
  const pauseSelf = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) video.pause();
  }, []);

  // videoRegistry 등록 및 이벤트 리스너 등록
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // registry에 pause 콜백 등록
    const unregister = register(pauseSelf);

    const onPlay = () => {
      setIsPlaying(true);
      setIsEnded(false);
      // 다른 비디오 모두 pause
      pauseOthers(pauseSelf);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setIsEnded(true); };
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onError = () => {
      const err = video.error;
      setError(err ? `오류 코드: ${err.code}` : '알 수 없는 오류가 발생했습니다.');
      setIsLoading(false);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('progress', onProgress);
    video.addEventListener('error', onError);

    return () => {
      unregister();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('error', onError);
    };
  }, [pauseSelf]);

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    playbackRate,
    isLoading,
    error,
    isEnded,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    changePlaybackRate,
  };
}
