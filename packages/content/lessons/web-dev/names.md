Look at a messy drawer of jars labelled "x", "thing" and "stuff2". You'd have to open every one to find the salt. Names in a program are labels too, and good names save you from opening jars.

## A name that says what's inside

```js
const m = 12;
const x = 4;
```

What are those? Nobody knows, not even you next week. Compare:

```js
const members = 12;
const tablesInTheRoom = 4;
```

Now each line explains itself. A good name says **what the value is**, not just that it's a number.

## How to write a name

JavaScript has some rules:

- letters, digits, `_` and `$` only: no spaces, no `-`;
- it can't start with a digit: `2players` isn't allowed, `players2` is;
- capital letters count: `score` and `Score` are two different names.

When a name has several words, join them and start each new word with a capital letter: `tablesInTheRoom`, `minutesPerOrbit`. That's called **camelCase**, because the capitals stick up like a camel's humps. It's how almost all JavaScript is written.

## Not too long, not too short

`n` is too short to say anything. `theNumberOfPeopleWhoAreMembersOfTheClubRightNow` is too long to read. `members` says it all. Aim for one to three words.

A few words can't be names at all, because JavaScript uses them itself: `let`, `const`, `if`, `for`, and some others.

## Break it on purpose

Use a `-` in a name:

```js
const tables-in-the-room = 4;
```

A `SyntaxError`. JavaScript reads the `-` as a minus sign: `tables` minus `in` minus... and gets lost. That's why names use camelCase.

---

## Mission: Oxygen supplies

The station keeps spare oxygen tanks: 7 of them, each lasting 20 hours. Keep both numbers in `crew.js`, with names that say what they are.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Oxygen tanks: 7
Hours per tank: 20
```

- The console shows `Oxygen tanks: 7` and `Hours per tank: 20`.
- Each number is kept under a name in camelCase that says what it is, and the line that logs it uses the name.

Psst, no spaces and no `-` in a name :)
