import i18next from 'i18next';

// The day an announcement went out, as its window and the admin's history show it
export function announcementDay(iso: string): string {
  return new Date(iso).toLocaleDateString(i18next.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
