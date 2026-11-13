You send two friends to two shops: one for bread, one for juice. Do you send the second one only when the first is back? No: both go at the same time, and breakfast starts when both are back. If each shop takes ten minutes, you wait ten minutes, not twenty.

## One after the other is slow

Two `await`s in a row wait one after the other:

```js
const bread = await fetch("https://shop.example/bread");
const juice = await fetch("https://shop.example/juice");
```

The second `fetch` only starts once the first answered. If each takes one second, the page waits two. But the two questions don't need each other: they could be asked together.

## `Promise.all`

`Promise.all` takes an array of promises and gives **one** promise, which holds an array of all their values, in the same order, once every one of them is in:

```js
const answers = await Promise.all([
  fetch("https://shop.example/bread"),
  fetch("https://shop.example/juice"),
]);
const bread = await answers[0].json();
const juice = await answers[1].json();
```

Both `fetch` calls start at once, since both are written inside the array before anything is awaited. One second later, both answers are in, and `answers[0]` is the bread's answer, `answers[1]` the juice's, whichever came first.

If one of them fails, the promise of `Promise.all` fails too: breakfast needs both.

## Break it on purpose

Swap `answers[0]` and `answers[1]`. Nothing warns you: the bread is now called juice. The order of the array you gave is the order you get back. Then put `await` in front of each `fetch` inside the array: `[await fetch(...), await fetch(...)]`. Each `await` waits right there, so the second question starts late again, and `Promise.all` gets two answers that are already in.

---

## Mission: The crew too

The practice API also knows the station's crew, at `https://cyberstars.app/api/practice/crew`. The tracker should say how many people are on board, without loading any slower.

**Example**: under the loading line, a new line shows, as soon as the answers are in:

```text
6 crew members on the station
```

The starship cards and their line show as before.

- Between `#tracker-status` and the list `ships`, a paragraph with the id `crew-on-board`.
- `loadShips` asks for the starships and the crew at the same time, and goes on once both answered.
- It writes in `#crew-on-board` how many crew members the API sent, then ` crew members on the station`.

Psst, both `fetch` calls go inside the array, with no `await` in front :)
