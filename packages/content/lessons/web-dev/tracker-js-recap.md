No new theory, just a challenge that uses `async` and `await`, `fetch` and JSON, a loading state, `response.ok`, `throw`, `try`, `catch` and `finally`, a button to try again, and destructuring.

---

## Mission: The crew panel

The tracker counts the crew, but never says who they are. Give the crew a panel of their own, with everything a good loading part has.

**Example**: under the biggest crews, a part with the heading "Crew". While it loads, a line says `Loading the crew...`. Then the line says `Crew on board: 6`, and a list shows:

```text
Vega, Commander
Orion, Pilot
Lyra, Engineer
...
```

When the crew can't load, the line says something like `Couldn't load the crew: The tracker answered 503`, and a `Try again` button shows.

- After the list `biggest-crews`, a section with the id `crew-panel` and a heading. In it, a paragraph with the id `crew-status` that a screen reader reads out politely, saying `Loading` at first, a button of type `button` with the id `crew-again`, hidden, and a list with the id `crew`, busy at first.
- An `async` function loads `https://cyberstars.app/api/practice/crew` when the page opens. The list is busy while it loads, and isn't once it's done, whatever happened.
- When all goes well, the list has an item for each person, their name, a comma and a space, then their role, in the API's order, and `#crew-status` says `Crew on board: ` and how many there are.
- When the answer isn't ok, or there's no connection, `#crew-status` says `Couldn't load the crew: ` and the error's message, and `#crew-again` shows. A click on it hides it, puts `Loading` back in `#crew-status` and loads again.

Psst, an answer that is an error doesn't throw by itself :)
