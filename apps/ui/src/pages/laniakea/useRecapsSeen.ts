import { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import * as laniakeaService from '../../services/laniakeaService';

// The board shows the recaps open, so while it is on screen the sidebar's
// Laniakea row has nothing to tell about them. Once the board shows, and again
// whenever a recap notification comes in, the server is told: it keeps the
// visit, reads the notification and pushes the counts, so the row's own count
// is only cleared here.
export function useRecapsSeen(shown: boolean): void {
  const { sections, clearSection } = useNotifications();
  const unread = sections.laniakea > 0;
  const told = useRef(false);
  useEffect(() => {
    if (!shown || (told.current && !unread)) return;
    told.current = true;
    laniakeaService.markSeen().catch(() => {
      // the next visit tells it again
    });
    if (unread) clearSection('laniakea');
  }, [shown, unread, clearSection]);
}
