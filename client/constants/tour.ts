import { TOUR_LESSON } from '../../shared/constants';

// Where a new account is held until it passes the tour lesson's tests.
export const TOUR_PATH = `/lesson/${TOUR_LESSON.courseKey}/${TOUR_LESSON.slug}`;

// Bubbles up from a lesson's code cell each time one of its runs ends, so the
// tour can wait for "run this cell" without the cell knowing about the tour.
export const CELL_RUN_EVENT = 'cyberstars:cell-run';
