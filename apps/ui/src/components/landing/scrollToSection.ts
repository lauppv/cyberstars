// Scrolled to by hand, so the scroll is smooth unless reduced motion is on and
// the address stays the page's own
export function scrollToSection(id: string) {
  const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
}
