/* global document, location */
// Runs in the head, before the page paints.
//
// An old link from when every address sat after a # (cyberstars.app/#/courses)
// goes to its real address, and a visitor who picked Romanian in this browser
// goes to the Romanian twin of the page. A crawler has no saved choice, so it
// stays on the address it asked for.
//
// Every public page carries its content pre-rendered for search engines and
// link previews. The app draws over it, so a browser running this script only
// ever shows that HTML on the landing page, to a visitor, where the app draws
// the same page. Elsewhere, and for a browser that last saw a signed-in student
// (AuthContext keeps the key), it's hidden before the first paint.
try {
  var path = location.pathname;
  var onRo = path === '/ro' || path.indexOf('/ro/') === 0;
  if (location.hash.indexOf('#/') === 0) {
    location.replace(location.hash.slice(1));
  } else if (!onRo && localStorage.getItem('cyberstars.lang.v2') === 'ro') {
    location.replace('/ro' + (path === '/' ? '' : path) + location.search + location.hash);
  }
  var landing = path === '/' || path === '/ro';
  if (!landing || localStorage.getItem('cyberstars.student') !== null) {
    document.documentElement.setAttribute('data-hide-prerender', '');
  }
} catch {
  // storage blocked: show the pre-rendered page, the safe default for a visitor
}
