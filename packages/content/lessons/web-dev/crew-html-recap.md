Your crew page has a navigation, lists, lists inside lists, and cards. One more section, and it uses all of them, with no steps to follow.

One new thing you'll need: a link can lead to an element on **another** page. Write that page's path, then `#` and the element's id: `bays.html#loading` opens `bays.html` and jumps straight to the element with the id `loading`.

---

## Mission: Duty Board

Every morning the crew checks who does what. On `crew.html`, after the cards:

- a section called **Duty Board**, with the id `duty`;
- right under its title, the day's duties, at least three, in the order they're done. For at least one duty, list the crew members who work on it, inside that duty;
- from **both** pages, a visitor should reach the duty board in one click: add a third link to both navigations, **Duty**, that goes straight to it.
