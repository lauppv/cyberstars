import { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import * as laniakeaService from '../../services/laniakeaService';

// The board shows the recaps open, so while the game is open the bell has
// nothing to tell about them. Opening it tells the server, which keeps the
// visit and reads the recap notification; the bell's own list is read here
// too, for the one it already holds and any that comes in during the game.
export function useRecapsSeen(): void {
  const { items, markOneRead } = useNotifications();
  useEffect(() => {
    laniakeaService.markSeen().catch(() => {
      // the next visit tells it again
    });
  }, []);
  useEffect(() => {
    for (const n of items) if (n.type === 'LANIAKEA_RECAP' && !n.readAt) markOneRead(n.id);
  }, [items, markOneRead]);
}
