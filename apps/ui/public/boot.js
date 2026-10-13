/* global document */
// Runs in the head, before the page paints. index.html carries the landing
// page pre-rendered in English for visitors and search engines. A browser that
// last saw a signed-in student (AuthContext keeps the key) is about to get the
// dashboard, and a visitor who picked Romanian is about to get the page
// redrawn in Romanian, so neither should see that HTML flash first.
try {
  var lang = localStorage.getItem('cyberstars.lang.v2') || 'en';
  if (localStorage.getItem('cyberstars.student') !== null || lang !== 'en') {
    document.documentElement.setAttribute('data-hide-prerender', '');
  }
} catch {
  // storage blocked: show the pre-rendered page, the safe default for a visitor
}
