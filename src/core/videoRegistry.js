/**
 * videoRegistry - 전역 싱글톤
 * 동시에 여러 비디오가 재생되는 것을 방지한다.
 */

const registry = new Set();

/**
 * pause 콜백을 등록한다.
 * @param {Function} pauseFn - 해당 비디오를 pause 하는 함수
 * @returns {Function} unregister 함수
 */
export function register(pauseFn) {
  registry.add(pauseFn);
  return () => {
    registry.delete(pauseFn);
  };
}

/**
 * excludeFn을 제외한 모든 등록된 비디오를 pause 한다.
 * @param {Function} excludeFn - pause 하지 않을 함수
 */
export function pauseOthers(excludeFn) {
  registry.forEach((fn) => {
    if (fn !== excludeFn) {
      fn();
    }
  });
}
