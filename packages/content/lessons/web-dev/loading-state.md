A shop that's still setting up hangs a sign on its door: "Opening soon". When everything is on the shelves, someone turns the sign around: "Open". Two moments, and the sign changes at each one. The tracker's list has such a sign already: `aria-busy`.

## Busy before, ready after

Since the CSS lessons, the tracker's list starts with `aria-busy="true"`, and its skeletons show only while it's busy. But nothing turns the sign around yet: the list says it's loading forever, even with the cards in, and the skeletons stay.

A loading state has two moments, and the script marks both:

```js
async function loadNews() {
  newsList.setAttribute("aria-busy", "true");
  const response = await fetch("https://school.example/news");
  const news = await response.json();
  // ... a card for each news ...
  newsList.setAttribute("aria-busy", "false");
}
```

- At the **start**, before anything is asked: busy. The HTML says so on the first load, but a function that loads again later must say it again itself.
- At the **end**, once everything is on the page: not busy.

With your CSS from before, that one attribute does all the rest: the skeletons show while it's busy and go once it isn't, and a screen reader waits, then reads the whole list at once.

## Try it slowly

The practice API answers in a blink, so you hardly see the skeletons. Add `?wait=2` to its address, and it waits two seconds before it answers:

```text
https://cyberstars.app/api/practice/starships?wait=2
```

Use it while you try your page, then take it away again.

## Break it on purpose

Set `aria-busy` to `"false"` right at the start instead of the end. The skeletons go at once, and for two seconds the list is empty: no starships, no skeletons, nothing to say something is coming. Then use `removeAttribute("aria-busy")` at the end. The list has no sign at all, and your CSS, which looks for `"false"`, keeps the skeletons.

---

## Mission: Ready!

The tracker's list should say when it's loading, and when it's done.

**Example**: open the tracker with `?wait=2` on the addresses. For two seconds the skeletons shimmer, then they go, and the five starship cards are there.

- `loadShips` makes the list `ships` busy when it starts, every time it is called.
- Once every card is in the list, the list is no longer busy (`aria-busy="false"`), so the skeletons go.

Psst, the HTML makes the list busy only once, when the page opens :)
