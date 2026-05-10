import { useState } from 'react';
import HaruPlayer from './players/haru/HaruPlayer';
import ShortsPlayer from './players/shorts/ShortsPlayer';
import PostPlayer from './players/post/PostPlayer';
import PlaylistPanel from './playlist/PlaylistPanel';
import styles from './App.module.css';

const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const PLAYLIST = [
  {
    id: 1,
    title: 'Haru Player - Horizontal Demo',
    subtitle: 'Haru Studio · 0:05',
    src: SAMPLE_VIDEO,
    duration: 5,
    views: '238K views',
  },
  {
    id: 2,
    title: 'Responsive Controls Demo',
    subtitle: 'Haru Studio · 0:05',
    src: SAMPLE_VIDEO,
    duration: 5,
    views: '91K views',
  },
  {
    id: 3,
    title: 'Keyboard Shortcuts Demo',
    subtitle: 'Haru Studio · 0:05',
    src: SAMPLE_VIDEO,
    duration: 5,
    views: '42K views',
  },
  {
    id: 4,
    title: 'Picture-in-Picture Demo',
    subtitle: 'Haru Studio · 0:05',
    src: SAMPLE_VIDEO,
    duration: 5,
    views: '16K views',
  },
  {
    id: 5,
    title: 'Loop Playback Demo',
    subtitle: 'Haru Studio · 0:05',
    src: SAMPLE_VIDEO,
    duration: 5,
    views: '184K views',
  },
];

const SHORTS_SAMPLES = [
  {
    id: 's1',
    title: 'Vertical motion sample',
    author: 'motion.cut',
    caption: 'Short-form player with muted autoplay, feed actions, and progress feedback.',
    src: SAMPLE_VIDEO,
    likes: 28400,
    comments: 1260,
    shares: 884,
  },
  {
    id: 's2',
    title: 'Reels-style control sample',
    author: 'field.note',
    caption: 'Designed for stacked feeds with quick reaction controls.',
    src: SAMPLE_VIDEO,
    likes: 19700,
    comments: 812,
    shares: 521,
  },
  {
    id: 's3',
    title: 'Auto-play viewport sample',
    author: 'open.frame',
    caption: 'IntersectionObserver pauses off-screen videos automatically.',
    src: SAMPLE_VIDEO,
    likes: 42100,
    comments: 2084,
    shares: 1190,
  },
];

const POST_SAMPLE = {
  title: 'Community Inline Player',
  author: 'haru.studio',
  location: 'Seoul Creative Lab',
  caption: 'A compact post player for community cards, comments, and inline media feeds.',
  src: SAMPLE_VIDEO,
  likes: 8420,
  comments: 214,
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [theaterMode, setTheaterMode] = useState(false);
  const current = PLAYLIST[activeIndex];

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo} aria-label="HaruPlayer">
          <span className={styles.logoMark}>H</span>
          <span className={styles.logoText}>aru</span>
          <span className={styles.logoSuffix}>Player</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={`${styles.watchSection} ${theaterMode ? styles.theaterSection : ''}`}>
          <div className={styles.watchGrid}>
            <div className={styles.playerArea}>
              <HaruPlayer
                src={current.src}
                title={current.title}
                theaterMode={theaterMode}
                onToggleTheater={() => setTheaterMode((value) => !value)}
              />

              <div className={styles.meta}>
                <div className={styles.metaText}>
                  <h1 className={styles.videoTitle}>{current.title}</h1>
                  <p className={styles.videoSubtitle}>{current.views} · Haru Studio</p>
                </div>
                <div className={styles.metaActions}>
                  <button type="button">Like</button>
                  <button type="button">Share</button>
                  <button type="button">Save</button>
                </div>
              </div>
            </div>

            <PlaylistPanel
              items={PLAYLIST}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Vertical Feed</span>
            <h2 className={styles.sectionTitle}>Shorts / Reels Player</h2>
          </div>
          <div className={styles.shortsRow}>
            {SHORTS_SAMPLES.map((item) => (
              <ShortsPlayer
                key={item.id}
                src={item.src}
                title={item.title}
                author={item.author}
                caption={item.caption}
                likes={item.likes}
                comments={item.comments}
                shares={item.shares}
                loop
                autoPlayOnView
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.kicker}>Community Media</span>
            <h2 className={styles.sectionTitle}>Post Player</h2>
          </div>
          <div className={styles.postRow}>
            <PostPlayer
              src={POST_SAMPLE.src}
              title={POST_SAMPLE.title}
              author={POST_SAMPLE.author}
              location={POST_SAMPLE.location}
              caption={POST_SAMPLE.caption}
              likes={POST_SAMPLE.likes}
              comments={POST_SAMPLE.comments}
              mutedByDefault={false}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
