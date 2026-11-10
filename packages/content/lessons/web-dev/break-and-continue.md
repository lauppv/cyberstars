Looking for your keys, you check your pockets one by one. As soon as you find them, you stop: no need to search the rest. A loop can stop early too, the moment it has found what it's looking for.

## `break`

`break` ends the loop at once, whatever lap it's on:

```js
const bags = ["books", "snacks", "keys", "gloves"];
for (const bag of bags) {
  console.log("Checking", bag);
  if (bag === "keys") {
    console.log("Found them!");
    break;
  }
}
```

```text
Checking books
Checking snacks
Checking keys
Found them!
```

"gloves" is never checked: the loop stopped at the keys. The script carries on with whatever comes after the loop.

## Remembering what you found

Often you want to know afterwards **what** was found, or whether anything was. Make a name before the loop, and fill it when you find it:

```js
let found = "nothing";
for (const bag of bags) {
  if (bag === "keys") {
    found = bag;
    break;
  }
}
console.log(found);
```

If no bag is "keys", the loop runs to the end without breaking, and `found` is still `"nothing"`.

## Break it on purpose

Put the `break` outside the `if`:

```js
for (const bag of bags) {
  if (bag === "keys") {
    found = bag;
  }
  break;
}
```

Only the first bag is ever checked. `break` stops the loop wherever it runs, so it belongs inside the `if`, where the thing is found.

---

## Mission: The first delay

Passengers want to know at a glance whether anything is delayed.

**Example**: under `#reserve`, a paragraph says:

```text
First delay: SL-103
```

And with no delayed flight on the board, it says `No delays`.

- A paragraph with the id `first-delay`.
- A loop goes through the flight table's rows from the top. At the first one whose status is `Delayed`, it notes that row's flight code and stops.
- The paragraph says `First delay: ` and that code, or `No delays` if no row was delayed.

Psst, `break` goes inside the `if` :)
