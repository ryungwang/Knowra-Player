import { useState, useRef, useEffect } from 'react';
import styles from './SettingsMenu.module.css';

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function SettingsMenu({ playbackRate, onChangePlaybackRate }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState('main'); // 'main' | 'speed'
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setPanel('main');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
    setPanel('main');
  };

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        className={styles.btn}
        onClick={handleToggle}
        title="설정"
        aria-label="설정"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      </button>

      {open && (
        <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
          {panel === 'main' && (
            <>
              <div className={styles.menuTitle}>설정</div>
              <button className={styles.menuItem} onClick={() => setPanel('speed')}>
                <span className={styles.itemLabel}>재생 속도</span>
                <span className={styles.itemValue}>
                  {playbackRate === 1 ? '표준' : `${playbackRate}x`}
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
                  </svg>
                </span>
              </button>
            </>
          )}

          {panel === 'speed' && (
            <>
              <button className={styles.backBtn} onClick={() => setPanel('main')}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
                재생 속도
              </button>
              {PLAYBACK_RATES.map((rate) => (
                <button
                  key={rate}
                  className={`${styles.menuItem} ${playbackRate === rate ? styles.active : ''}`}
                  onClick={() => {
                    onChangePlaybackRate(rate);
                    setOpen(false);
                    setPanel('main');
                  }}
                >
                  {rate === 1 ? '표준' : `${rate}x`}
                  {playbackRate === rate && (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
