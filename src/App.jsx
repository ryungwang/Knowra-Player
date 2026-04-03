import { useState } from 'react';
import KnowraPlayer from './players/knowra/KnowraPlayer';
import ShortsPlayer from './players/shorts/ShortsPlayer';
import PostPlayer from './players/post/PostPlayer';
import PlaylistPanel from './playlist/PlaylistPanel';
import styles from './App.module.css';

// 샘플 재생목록 (공개 도메인 영상)
const PLAYLIST = [
  {
    id: 1,
    title: 'Big Buck Bunny',
    subtitle: 'Blender Foundation · 9:56',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    duration: 596,
  },
  {
    id: 2,
    title: 'Elephant Dream',
    subtitle: 'Blender Foundation · 10:54',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/320px-Elephants_Dream_s5_both.jpg',
    duration: 654,
  },
  {
    id: 3,
    title: 'For Bigger Blazes',
    subtitle: 'Google · 0:15',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
  },
  {
    id: 4,
    title: 'Subaru Outback',
    subtitle: 'Google · 0:30',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: 30,
  },
  {
    id: 5,
    title: 'Tears of Steel',
    subtitle: 'Blender Foundation · 12:14',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
  },
];

// Shorts 샘플 데이터
const SHORTS_SAMPLES = [
  {
    id: 's1',
    title: 'For Bigger Blazes - Short Clip',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 's2',
    title: 'Subaru Outback - Short Clip',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  },
];

// Post 샘플 데이터
const POST_SAMPLE = {
  title: 'Elephant Dream - 인라인 카드 플레이어',
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/320px-Elephants_Dream_s5_both.jpg',
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = PLAYLIST[activeIndex];

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg viewBox="0 0 90 20" fill="none" width="90" height="20" aria-label="KnowraPlayer">
            <text x="0" y="16" fill="#ff0000" fontSize="18" fontWeight="700" fontFamily="sans-serif">K</text>
            <text x="13" y="16" fill="#ffffff" fontSize="18" fontWeight="700" fontFamily="sans-serif">nowra</text>
          </svg>
          <span className={styles.logoSuffix}>Player</span>
        </div>
      </header>

      <main className={styles.main}>

        {/* ── 섹션 1: KnowraPlayer (재생목록 포함) ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>KnowraPlayer</h2>
          <div className={styles.playerArea}>
            <KnowraPlayer
              src={current.src}
              title={current.title}
              poster={current.poster}
            />

            <div className={styles.meta}>
              <h3 className={styles.videoTitle}>{current.title}</h3>
              {current.subtitle && (
                <p className={styles.videoSubtitle}>{current.subtitle}</p>
              )}
            </div>

            <div className={styles.shortcutHint}>
              <strong>키보드 단축키</strong>
              <span>Space / K — 재생/정지</span>
              <span>← / → — 5초 이동</span>
              <span>↑ / ↓ — 볼륨</span>
              <span>M — 음소거</span>
              <span>F — 전체화면</span>
            </div>
          </div>

          <PlaylistPanel
            items={PLAYLIST}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </section>

        {/* ── 섹션 2: ShortsPlayer ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ShortsPlayer</h2>
          <p className={styles.sectionDesc}>9:16 세로형 · 화면 진입 시 자동재생 · 동시재생 방지</p>
          <div className={styles.shortsRow}>
            {SHORTS_SAMPLES.map((item) => (
              <ShortsPlayer
                key={item.id}
                src={item.src}
                title={item.title}
                loop
                autoPlayOnView
              />
            ))}
          </div>
        </section>

        {/* ── 섹션 3: PostPlayer ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>PostPlayer</h2>
          <p className={styles.sectionDesc}>카드형 인라인 플레이어 · hover 시 컨트롤 표시</p>
          <div className={styles.postRow}>
            <PostPlayer
              src={POST_SAMPLE.src}
              poster={POST_SAMPLE.poster}
              title={POST_SAMPLE.title}
              mutedByDefault={false}
            />
          </div>
        </section>

      </main>
    </div>
  );
}
