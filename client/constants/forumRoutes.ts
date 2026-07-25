/**
 * Single source of truth for the forum's URL shapes. Every forum level is a real
 * route so the browser back button, refresh, and shared links all work.
 */
export const forumRoutes = {
  index: '/forum',
  category: (slug: string) => `/forum/c/${encodeURIComponent(slug)}`,
  thread: (id: number) => `/forum/t/${id}`,
};
