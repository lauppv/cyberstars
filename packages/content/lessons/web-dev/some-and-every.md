Before a school trip, the teacher asks two different questions. "Has anyone forgotten their lunch?": one child is enough for a yes. "Has everyone brought their permission slip?": one missing slip is enough for a no. Arrays have a method for each question.

## `some`: is there one?

`some` answers `true` when **at least one** item matches its question:

```js
const lunches = ["sandwich", "pasta", "none", "salad"];

console.log(lunches.some((lunch) => lunch === "none"));
console.log(lunches.some((lunch) => lunch === "pizza"));
```

```text
true
false
```

One child has no lunch, so the first answer is yes. Nobody has pizza, so the second is no. `some` stops at the first item that matches: it doesn't need to look further.

## `every`: are they all?

`every` answers `true` only when **all** the items match:

```js
const slips = [true, true, false, true];

console.log(slips.every((slip) => slip === true));
```

```text
false
```

One slip is missing, so not everyone has one. `every` stops at the first item that doesn't match.

## With objects

Both take the same kind of question as `filter` and `find`, so they work on objects too:

```js
const players = [
  { name: "Mia", age: 12 },
  { name: "Leo", age: 14 },
  { name: "Sara", age: 13 },
];

if (players.every((player) => player.age >= 12)) {
  console.log("Everyone can join the team");
}
if (players.some((player) => player.age > 13)) {
  console.log("Someone is older than 13");
}
```

```text
Everyone can join the team
Someone is older than 13
```

`some` and `every` always answer `true` or `false`, so they fit straight into an `if`.

## Break it on purpose

Use `some` where you mean `every`: `players.some((player) => player.age >= 14)` answers `true`, because Leo is 14. But it doesn't mean the whole team is 14. Read your line out loud: "is there **one**?" is `some`, "are they **all**?" is `every`.

---

## Mission: How are the supplies?

The commander wants one short line about all the supplies, before reading the details.

**Example**: under the first supply to refill, the dashboard says one of these:

```text
All supplies are fine
Refill soon
Refill now!
```

- Under `#first-refill`, a paragraph with the id `supply-status`.
- When every supply is at 25 or more, it says `All supplies are fine`.
- Otherwise, when at least one supply is under 10, it says `Refill now!`. Otherwise, `Refill soon`.

Psst, `every` answers "are they all?", `some` answers "is there one?" :)
