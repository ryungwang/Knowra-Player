import PlaylistItem from './PlaylistItem';
import styles from './PlaylistPanel.module.css';

export default function PlaylistPanel({ items, activeIndex, onSelect }) {
  if (!items || items.length === 0) return null;

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.heading}>재생목록</h2>
        <span className={styles.count}>{activeIndex + 1} / {items.length}</span>
      </div>
      <div className={styles.list}>
        {items.map((item, i) => (
          <PlaylistItem
            key={item.id ?? i}
            item={item}
            index={i}
            isActive={i === activeIndex}
            onClick={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}
