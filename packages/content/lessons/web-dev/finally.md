When you leave a room, you switch off the light. You do it whether the meeting went well or badly, whether it ended on time or early. It's what you do at the end, whatever happened. JavaScript has a place for that too.

## Busy forever

Try your tracker with the broken address, `https://cyberstars.app/api/practice/broken`. The line says what went wrong, but the skeletons keep shimmering under it. The list is still busy: `aria-busy="false"` is written after the cards, inside `try`, and an error jumps over it.

You could write it in `catch` too. But then it's written twice, and every new problem is one more place to forget it.

## `finally`

After `try` and `catch`, a third part, `finally`, runs **always**: after `try` when all went well, after `catch` when something threw.

```js
async function loadNews() {
  newsList.setAttribute("aria-busy", "true");
  try {
    const response = await fetch("https://school.example/news");
    // ... read the news, a card for each ...
  } catch (error) {
    newsLine.textContent = `No news: ${error.message}`;
  } finally {
    newsList.setAttribute("aria-busy", "false");
  }
}
```

Whatever happens, the list stops being busy. The two moments of a loading state now sit at the very start and the very end of the function, easy to find. `finally` even runs after a `return` inside `try`.

## Break it on purpose

Put the line back inside `try`, after the cards, and keep the `finally` empty. All works with good answers, and on an error the skeletons shimmer forever again. Then write the line before `try` instead: the list isn't busy for even a moment, so the skeletons never show.

---

## Mission: Lights off

The tracker's list should stop being busy at the end of every load, whatever happened.

**Example**: with the broken address, the line says what went wrong, and the skeletons are gone. With good answers, the skeletons show until the cards come, as before.

- `loadShips` makes the list `ships` not busy in `finally`, once, after `try` and `catch`.
- After an error, or with no connection, the list is not busy and the skeletons are gone.
- With good answers, the list is busy until the cards are in.

Psst, one line in `finally` covers both ways a load can end :)
