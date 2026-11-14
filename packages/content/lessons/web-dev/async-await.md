A recipe says: "Put the water on to boil. When it boils, add the pasta. When the pasta is soft, pour it out." Each step waits for the one before it, and the recipe reads from top to bottom. With `.then`, waiting for three things one after the other means a function inside a function inside a function. There's a way to write it like the recipe.

## `async` and `await`

Write `async` in front of a function, and inside it you may write `await` in front of a promise. `await` waits for the promise, then gives you the value it holds:

```js
async function cookPasta() {
  console.log("Boiling the water");
  await cookLater("hot water", 1000);
  console.log("Adding the pasta");
  const pasta = await cookLater("soft pasta", 2000);
  console.log("Pouring out the " + pasta);
}

cookPasta();
console.log("Laying the table");
```

```text
Boiling the water
Laying the table
Adding the pasta
Pouring out the soft pasta
```

(`cookLater` is the function from the last lessons: a promise of a dish, `ms` milliseconds later.)

Inside `cookPasta`, the lines run one after the other, each `await` waiting for its promise: one second, then two more. `const pasta = await ...` keeps the value, as `.then` would give it.

Look where "Laying the table" is, though. Outside the function, nothing waits. At the first `await`, the function pauses, and the rest of the script goes on. The page never freezes: only the `async` function waits, and only inside itself.

An arrow function can be `async` too: `const cookPasta = async () => { ... };`.

## Break it on purpose

Leave out `await` in `const pasta = cookLater("soft pasta", 2000);`. The console says "Pouring out the [object Promise]" at once: without `await`, you get the ticket, not the pasta. Then take `async` away from the function, and keep the `await`s. The browser refuses the whole script: `await` is only allowed inside an `async` function, and the console says so.

---

## Mission: Radar scan

Before the tracker shows its starships, it scans the sky with its radar, three times. Show each scan on the line, and use your slow tracker to wait between them.

**Example**: the line `#tracker-status` says, half a second apart:

```text
Scanning 1 of 3
Scanning 2 of 3
Scanning 3 of 3
Starships found
```

- In `tracker.js`, an `async` function called `scanRadar` writes each step in `#tracker-status`, from `Scanning 1 of 3` when the page opens to `Starships found` at the end.
- Between two steps it waits half a second with `await` and `answerLater`.
- The page calls it when it opens, instead of the `.then` of the earlier lesson.

Psst, `await` works only inside a function with `async` in front :)
