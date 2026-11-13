No new theory, just a challenge that uses what this part's JavaScript taught: arrow functions, default values, scope, `style`, bubbling, `closest`, one script for every page and `aria-expanded`. It needs this part's CSS too, `position` most of all, and `keydown` from the boarding form.

This time nobody tells you which lines to write. Read what the visitor needs, and put it together yourself. When you're not sure how to do a part, open the lesson it comes from again.

---

## Mission: A menu that opens from a button

On a phone, the menu still takes room at the top of every page. Most sites keep their menu closed behind a button, and open it over the page only when the visitor asks for it.

**Example**: open any page. The header shows the station's name and the Menu button, and no links. Click **Menu**: the five links open one under the other, just under the header, over the page. The page under them doesn't move. Press Escape, or click somewhere on the page: the menu closes.

- On every page, the menu starts closed. `#menu-button` opens it and closes it, and its `aria-expanded` always says which.
- Open, the menu's links stand one under the other, under the header and over the page, and the page doesn't move. The menu has a background of its own, so the page doesn't show through it.
- Escape closes the menu, wherever the focus is, on a link of the menu too. A click on the page outside the header closes it as well.
- A page without the button still shows no error. Everything else works as before: the header sticks to the top, Back to top, the wiki's cards.

Psst, the click on the button goes up to the page too :)
