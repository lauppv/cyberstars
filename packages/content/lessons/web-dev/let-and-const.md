Think of a labelled jar in the kitchen: "Sugar". You don't have to remember what's inside, the label tells you. And whenever a recipe says "a spoon of sugar", you know which jar to open.

Programs keep values in labelled jars too. A label and its value is a **variable**.

## `const`

```js
const members = 12;
console.log("Members:", members);
```

```text
Members: 12
```

`const` makes a name, `members`, for a value, `12`. From then on, wherever the script says `members`, it means 12. You write the name without quotes: `members` is the jar, `"members"` would be the word "members".

The `=` here doesn't mean "is equal to" like in maths. It means "put this value in that name".

## Why bother?

A value used in several places only needs changing once:

```js
const club = "Game Club";
console.log("Welcome to the", club);
console.log("Thanks for visiting the", club);
```

Rename the club in one line, and both messages change.

## A constant stays the same

`const` is short for **constant**: the value can never change. Try to put another value in it, and the script stops:

```js
const members = 12;
members = 13;
```

```text
TypeError: Assignment to constant variable.
```

For values that do change, there's another word, which you'll meet in the next lesson.

## Break it on purpose

Use the name before it's made:

```js
console.log(club);
const club = "Game Club";
```

An error: the script reads from top to bottom, and on line 1 the jar doesn't exist yet. Make the name first, use it after.

---

## Mission: Station numbers

The station has a few numbers that never change. Keep them in `crew.js`, each under a name.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Minutes per orbit: 92
Crew on board: 4
```

- The console shows `Minutes per orbit: 92`.
- The console shows `Crew on board: 4`.
- Each number is kept under a name with `const`, and the line that logs it uses the name.

Psst, the name goes without quotes when you use it :)
