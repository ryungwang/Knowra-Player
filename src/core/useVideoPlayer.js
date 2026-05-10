import { useCallback, useEffect, useRef, useState } from 'react';
import { pauseOthers, register } from './videoRegistry';

export function useVideoPlayer({
  defaultMuted = false,
  defaultVolume = 1,
  onPlay,
  onPause,
  onEnded,
  onWaiting,
  onCanPlay,
  onTimeUpdate,
  onDurationChange,
  onProgress,
  onVolumeChange,
  onRateChange,
  onError,
} = {}) {
  const videoRef = useRef(null);
  const lastVolumeRef = useRef(defaultVolume > 0 ? defaultVolume : 1);
  const callbacksRef = useRef({
    onPlay,
    onPause,
    onEnded,
    onWaiting,
    onCanPlay,
    onTimeUpdate,
    onDurationChange,
    onProgress,
    onVolumeChange,
    onRateChange,
    onError,
  });

  useEffect(() => {
    callbacksRef.current = {
      onPlay,
      onPause,
      onEnded,
      onWaiting,
      onCanPlay,
      onTimeUpdate,
      onDurationChange,
      onProgress,
      onVolumeChange,
      onRateChange,
      onError,
    };
  }, [
    onPlay,
    onPause,
    onEnded,
    onWaiting,
    onCanPlay,
    onTimeUpdate,
    onDurationChange,
    onProgress,
    onVolumeChange,
    onRateChange,
    onError,
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isPip, setIsPip] = useState(false);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch((err) => setError(err.message));
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      play();
    } else {
      pause();
    }
  }, [pause, play]);

  const seek = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const nextTime = Math.max(0, Math.min(time, duration));
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const skip = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video) return;
    seek(video.currentTime + seconds);
  }, [seek]);

  const changeVolume = useCallback((value) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, value));

    video.volume = clamped;
    video.muted = clamped === 0;
    if (clamped > 0) {
      lastVolumeRef.current = clamped;
    }

    setVolume(clamped);
    setIsMuted(video.muted);
  }, []);

  const setMuted = useCallback((muted) => {
    const video = videoRef.current;
    if (!video) return;

    if (muted) {
      video.muted = true;
    } else {
      video.muted = false;
      if (video.volume === 0) {
        const restoredVolume = lastVolumeRef.current || 0.75;
        video.volume = restoredVolume;
        setVolume(restoredVolume);
      }
    }

    setIsMuted(video.muted || video.volume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setMuted(!(video.muted || video.volume === 0));
  }, [setMuted]);

  const changePlaybackRate = useCallback((rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const toggleLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = !video.loop;
    setIsLooping(video.loop);
  }, []);

  const togglePictureInPicture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch((err) => setError(err.message));
      return;
    }

    video.requestPictureInPicture?.().catch((err) => setError(err.message));
  }, []);

  const pauseSelf = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) video.pause();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(1, defaultVolume));
    video.muted = defaultMuted;
    setVolume(video.volume);
    setIsMuted(video.muted || video.volume === 0);
  }, [defaultMuted, defaultVolume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const unregister = register(pauseSelf);

    const onPlay = () => {
      setIsPlaying(true);
      setIsEnded(false);
      pauseOthers(pauseSelf);
      callbacksRef.current.onPlay?.({ video });
    };
    const onPause = () => {
      setIsPlaying(false);
      callbacksRef.current.onPause?.({ video });
    };
    const onEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
      callbacksRef.current.onEnded?.({ video });
    };
    const onTimeUpdate = () => {
      const nextTime = video.currentTime;
      const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
      setCurrentTime(nextTime);
      callbacksRef.current.onTimeUpdate?.({
        video,
        currentTime: nextTime,
        duration: nextDuration,
      });
    };
    const onDurationChange = () => {
      const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
      setDuration(nextDuration);
      callbacksRef.current.onDurationChange?.({
        video,
        currentTime: video.currentTime,
        duration: nextDuration,
      });
    };
    const onLoadStart = () => {
      setError(null);
      setBuffered(0);
      setIsLoading(true);
    };
    const onWaiting = () => {
      setIsLoading(true);
      callbacksRef.current.onWaiting?.({ video });
    };
    const onCanPlay = () => {
      setIsLoading(false);
      callbacksRef.current.onCanPlay?.({ video });
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      const muted = video.muted || video.volume === 0;
      setIsMuted(muted);
      if (video.volume > 0) {
        lastVolumeRef.current = video.volume;
      }
      callbacksRef.current.onVolumeChange?.({
        video,
        volume: video.volume,
        muted,
      });
    };
    const onRateChange = () => {
      setPlaybackRate(video.playbackRate);
      callbacksRef.current.onRateChange?.({
        video,
        playbackRate: video.playbackRate,
      });
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        const nextBuffered = video.buffered.end(video.buffered.length - 1);
        const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
        setBuffered(nextBuffered);
        callbacksRef.current.onProgress?.({
          video,
          buffered: nextBuffered,
          currentTime: video.currentTime,
          duration: nextDuration,
        });
      }
    };
    const onError = () => {
      const err = video.error;
      const message = err ? `오류 코드: ${err.code}` : '영상을 불러오지 못했습니다.';
      setError(message);
      setIsLoading(false);
      callbacksRef.current.onError?.({
        video,
        error: err,
        message,
      });
    };
    const onEnterPip = () => setIsPip(true);
    const onLeavePip = () => setIsPip(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadedmetadata', onDurationChange);
    video.addEventListener('loadstart', onLoadStart);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ratechange', onRateChange);
    video.addEventListener('progress', onProgress);
    video.addEventListener('error', onError);
    video.addEventListener('enterpictureinpicture', onEnterPip);
    video.addEventListener('leavepictureinpicture', onLeavePip);

    return () => {
      unregister();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadedmetadata', onDurationChange);
      video.removeEventListener('loadstart', onLoadStart);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ratechange', onRateChange);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('error', onError);
      video.removeEventListener('enterpictureinpicture', onEnterPip);
      video.removeEventListener('leavepictureinpicture', onLeavePip);
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
    isLooping,
    isPip,
    play,
    pause,
    togglePlay,
    seek,
    skip,
    changeVolume,
    setMuted,
    toggleMute,
    changePlaybackRate,
    toggleLoop,
    togglePictureInPicture,
  };
}
