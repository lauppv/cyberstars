import { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import * as laniakeaService from '../../services/laniakeaService';

// The board shows the recaps open, so while it is on screen the bell has
// nothing to tell about them. Once the board shows, and again whenever a recap
// notification comes in, the server is told: it keeps the visit, reads the
// notification and pushes the count, so the bell's own copy is only shown read.
export function useRecapsSeen(shown: boolean): void {
  const { items, noteRead } = useNotifications();
  const unread = items
    .filter((n) => n.type === 'LANIAKEA_RECAP' && !n.readAt)
    .map((n) => n.id)
    .join(',');
  const told = useRef(false);
  useEffect(() => {
    if (!shown || (told.current && !unread)) return;
    told.current = true;
    laniakeaService.markSeen().catch(() => {
      // the next visit tells it again
    });
    for (const id of unread ? unread.split(',') : []) noteRead(Number(id));
  }, [shown, unread, noteRead]);
}
