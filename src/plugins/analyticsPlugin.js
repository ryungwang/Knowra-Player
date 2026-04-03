/**
 * analyticsPlugin - stub (v2용)
 * 실제 구현 없음 - 시그니처 정의만
 */

/**
 * 비디오 분석 훅 stub
 *
 * @param {React.RefObject} videoRef - video 요소 ref
 * @param {{ onPlay?: Function, onPause?: Function, onProgress?: Function }} callbacks
 */
// eslint-disable-next-line no-unused-vars
export function useAnalytics(videoRef, { onPlay, onPause, onProgress } = {}) {
  // v2에서 구현 예정
  // TODO: play 이벤트 → onPlay(currentTime) 호출
  // TODO: pause 이벤트 → onPause(currentTime) 호출
  // TODO: timeupdate 이벤트 → onProgress(percent) 호출
}
