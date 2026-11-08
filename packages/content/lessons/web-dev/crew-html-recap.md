Your crew page has a navigation, lists, lists in lists and cards. One more piece, and it uses all of them.

Worth keeping in mind:

- **Paths are directions from the page that names them**: `crew.html` next to it, `img/station.svg` in a folder, `../index.html` one folder up.
- **A link can lead to an id on another page**: the page's path, then `#` and the id, like `bays.html#loading`.
- **`ul` when order doesn't matter, `ol` when it does**, and only `li` elements directly inside either.
- **A nested list goes inside an item**, after its text.
- **`div` and `span` mean nothing**; reach for them when no element says what the box is.

---

## Mission: Duty Board

- On `crew.html`, after the cards, a section heading **Duty Board** with the id `duty`.
- Right under it, the day's duties in order, at least three. Under at least one duty, inside its item, a list of the crew members on it.
- In the navigation of **both** pages, a third link, **Duty**, that leads straight to the duty board on the crew page.
