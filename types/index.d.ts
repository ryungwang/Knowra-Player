import * as React from 'react';

export type VideoSource = {
  src: string;
  type?: string;
};

export type PlayerVideoPayload = {
  video: HTMLVideoElement;
};

export type PlayerTimePayload = PlayerVideoPayload & {
  currentTime: number;
  duration: number;
};

export type PlayerProgressPayload = PlayerTimePayload & {
  buffered: number;
};

export type PlayerVolumePayload = PlayerVideoPayload & {
  volume: number;
  muted: boolean;
};

export type PlayerRatePayload = PlayerVideoPayload & {
  playbackRate: number;
};

export type PlayerErrorPayload = PlayerVideoPayload & {
  message: string;
  error: MediaError | Error | null;
};

export type PlayerEventCallbacks = {
  onPlay?: (payload: PlayerVideoPayload) => void;
  onPause?: (payload: PlayerVideoPayload) => void;
  onEnded?: (payload: PlayerVideoPayload) => void;
  onWaiting?: (payload: PlayerVideoPayload) => void;
  onCanPlay?: (payload: PlayerVideoPayload) => void;
  onTimeUpdate?: (payload: PlayerTimePayload) => void;
  onDurationChange?: (payload: PlayerTimePayload) => void;
  onProgress?: (payload: PlayerProgressPayload) => void;
  onVolumeChange?: (payload: PlayerVolumePayload) => void;
  onRateChange?: (payload: PlayerRatePayload) => void;
  onError?: (payload: PlayerErrorPayload) => void;
};

export type CommonPlayerProps = PlayerEventCallbacks & {
  src?: string;
  sources?: VideoSource[];
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  videoProps?: Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    'src' | 'poster' | 'autoPlay' | 'loop' | 'muted' | 'children'
  >;
};

export type HaruPlayerProps = CommonPlayerProps & {
  theaterMode?: boolean;
  onToggleTheater?: () => void;
};

export type ShortsPlayerProps = Omit<CommonPlayerProps, 'autoPlay'> & {
  author?: string;
  avatar?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  loop?: boolean;
  autoPlayOnView?: boolean;
  onLikeChange?: (liked: boolean) => void;
  onSaveChange?: (saved: boolean) => void;
  onFollowChange?: (followed: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
};

export type PostPlayerProps = CommonPlayerProps & {
  author?: string;
  avatar?: string;
  location?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  mutedByDefault?: boolean;
  onLikeChange?: (liked: boolean) => void;
  onSaveChange?: (saved: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
  onMore?: () => void;
};

export type UseVideoPlayerOptions = PlayerEventCallbacks & {
  defaultMuted?: boolean;
  defaultVolume?: number;
};

export type UseVideoPlayerReturn = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isLoading: boolean;
  error: string | null;
  isEnded: boolean;
  isLooping: boolean;
  isPip: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  changeVolume: (value: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  changePlaybackRate: (rate: number) => void;
  toggleLoop: () => void;
  togglePictureInPicture: () => void;
};

export type UseFullscreenReturn = {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

export function HaruPlayer(props: HaruPlayerProps): React.ReactElement;
export function ShortsPlayer(props: ShortsPlayerProps): React.ReactElement;
export function PostPlayer(props: PostPlayerProps): React.ReactElement;
export function BasePlayer(props: {
  src?: string;
  autoPlay?: boolean;
  children?: React.ReactNode | ((player: UseVideoPlayerReturn & {
    containerRef: React.RefObject<HTMLElement | null>;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
  }) => React.ReactNode);
}): React.ReactElement | null;

export function useVideoPlayer(options?: UseVideoPlayerOptions): UseVideoPlayerReturn;
export function useAutoPlayOnView(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options?: {
    enabled?: boolean;
    threshold?: number;
    muted?: boolean;
  }
): void;
export function useFullscreen(targetRef: React.RefObject<HTMLElement | null>): UseFullscreenReturn;
export function formatTime(seconds?: number): string;
export function formatTimeFromPercent(percent: number, duration: number): string;
export function formatCount(count?: number): string;
