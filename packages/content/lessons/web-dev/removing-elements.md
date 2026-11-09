Adding is half the job. Your phone's notifications disappear when you swipe them away, a to-do app crosses off done tasks, a game removes the coins you pick up. Elements can leave the page too.

## `remove()`

Every element has a `remove` method that takes it off the page:

```js
document.querySelector("#ad").remove();
```

The element with the id `ad` is gone, as if it had never been in the HTML. Everything after it moves up into its place.

## Removing the last item

A selector can pick the last item of a list, as in CSS:

```js
document.querySelector("#games li:last-child").remove();
```

`li:last-child` is the `li` that's the last one in its list. Click it on a button, and each click removes whichever item is last **at that moment**: first darts, then cards, then chess.

## Gone from the page, not from the file

As always, the script changes the page in the browser. Your HTML file still has every item. Reload, and they're all back.

## Break it on purpose

Keep removing after the list is empty:

```js
document.querySelector("#games li:last-child").remove();
```

When no `li` is left, `querySelector` gives `null`, and the console says:

```text
TypeError: Cannot read properties of null (reading 'remove')
```

`null` has no `remove`. You'll learn to check for that in part 3. For now, it's enough to know what the error means.

---

## Mission: Remove the last

Sometimes a rookie added by mistake has to go.

**Example**: next to `Add a rookie`, a button says `Remove the last`. Add two rookies, then click it: `Rookie 2` is gone, and `Rookie 1` is the last name again.

- A button with the id `remove-last`, saying `Remove the last`.
- Each click removes the last item of the crew list, whatever it is at that moment.

Psst, the last item is picked again on every click :)
