You order a book online, and the parcel comes. You open it, and inside there's a note: "Sorry, this book is sold out." The parcel arrived, so the delivery worked, but you didn't get what you asked for. An answer from `fetch` can be like that note.

## An answer can be an error

`fetch` gives you a response whenever the other computer answers, even when it answers "I have nothing for you" (`404`) or "I'm broken right now" (`500`). Its promise only fails when no answer comes at all.

So a script that reads every answer as data gets into trouble. The practice API has an address that always fails, to try it:

```text
https://cyberstars.app/api/practice/broken
```

Open it in a tab. It answers `{"error": "The tracker is down for repairs. Try again later."}`, an object, not a list of starships. A `for...of` over it throws: `ships is not iterable`.

## `response.ok`

Every response has `ok`: `true` for a status from 200 to 299, `false` for anything else. Check it before you read the data:

```js
const response = await fetch("https://school.example/news");
if (!response.ok) {
  newsLine.textContent = `No news today: ${response.status}`;
  return;
}
const news = await response.json();
```

`return` ends the function right there, so nothing after it runs on an error.

With two answers from `Promise.all`, both must be ok. `find` gives you the first one that isn't:

```js
const failed = answers.find((answer) => !answer.ok);
```

`failed` is `undefined` when all went well, and the failed response otherwise, with its `status`.

## Break it on purpose

Write the check, but forget the `return`. The line says the error, then the script goes on and reads the error as data, and the console shows `ships is not iterable`. Then check only the first answer: when the crew's answer fails, the tracker shows the starships and "undefined crew members".

---

## Mission: Down for repairs

The tracker should notice when the practice API answers with an error, and say so.

**Example**: when an answer is an error, like `500`, the line says:

```text
The tracker didn't answer: 500
```

No cards and no crew line show, and the console stays free of errors.

- When the starships' answer or the crew's answer isn't ok, `loadShips` writes in `#tracker-status` `The tracker didn't answer: ` and that answer's status, and stops there.
- When both are ok, the tracker shows its cards and lines as before.

Psst, without `return`, the function goes on after the check :)
