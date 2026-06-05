import { useEffect } from 'react';
import type { AlmanacArticle } from '../../shared/almanac';
import './AlmanacPage.css';

export function StoryModal({ story, onClose }: { story: AlmanacArticle; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="story-overlay" onMouseDown={onClose}>
      <div className="story-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="story-close" onClick={onClose}>
          ✕
        </button>
        <div className="story-modal-art">
          <div
            className="story-modal-art-grad"
            style={{
              background:
                story.grad || 'linear-gradient(135deg,#000814 0%,#001d3d 60%,#003566 100%)',
            }}
          />
          <span className="story-modal-emoji">{story.emoji}</span>
          {story.tag && <span className="story-modal-tag">{story.tag}</span>}
          {story.year && <span className="story-modal-year">{story.year}</span>}
        </div>
        <div className="story-modal-body">
          <h2 className="story-modal-title">{story.title}</h2>
          <div className="story-modal-text">
            {story.fullText.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
