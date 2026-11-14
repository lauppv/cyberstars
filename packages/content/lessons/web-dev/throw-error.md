At school, when anything goes wrong in class, a broken window, a fight, a lost bag, it all goes to the same place: the school office. One person there knows what to do. Your tracker has two places that handle problems now. One office would be easier.

## Two ways to fail

After the last lessons, `loadShips` handles problems twice: an answer that is an error in an `if`, no answer at all in `catch`. Each writes its own text. Add one more problem later, and you write a third.

You can send every problem to `catch` instead, by **throwing** an error yourself.

## `throw new Error`

`new Error("...")` makes an error object with a message. `throw` stops the code right there, as a failed `fetch` does, and jumps to the closest `catch`:

```js
try {
  const response = await fetch("https://school.example/news");
  if (!response.ok) {
    throw new Error(`The school answered ${response.status}`);
  }
  // ... read the news ...
} catch (error) {
  newsLine.textContent = `No news: ${error.message}`;
}
```

- An answer that is an error throws your error, with your message.
- No answer at all throws the browser's error, with the browser's message.
- Both land in the same `catch`, and `error.message` holds the message, whichever it is.

No `return` is needed after `throw`: nothing after it inside `try` runs anyway.

## Break it on purpose

Throw a plain text: `throw "The school answered 500";`. It still jumps to `catch`, but a text has no `message`, so the page says "No news: undefined". Always throw `new Error(...)`. Then write `new Error(...)` without `throw`. The error is made and thrown away, and the code goes on as if all was well.

---

## Mission: One office for every problem

Every problem of the tracker should go through `catch`, with a message that says what happened.

**Example**: when the starships' answer is `500`, the line says:

```text
Couldn't load the starships: The tracker answered 500
```

With no connection, it starts the same way, followed by the browser's message.

- When an answer isn't ok, `loadShips` throws a new error with the message `The tracker answered ` and that answer's status.
- `catch` writes in `#tracker-status` `Couldn't load the starships: ` and the error's message, for every error.
- When everything works, the tracker shows its cards and lines as before.

Psst, the message is in `error.message`, not in `error` itself :)
