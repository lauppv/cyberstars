A school report has a line for each subject: maths, a mark; English, a mark; art, a mark. To read it out to your family, you go down the report one line at a time: the subject, then its mark. An object is like that report, and `for...in` reads it line by line.

## An object, one property at a time

You know objects from the Flight Schedule: names, called **keys**, each with its value. `for...in` goes through every key of an object:

```js
const report = { maths: 9, English: 8, art: 10 };

for (const subject in report) {
  console.log(subject);
}
```

```text
maths
English
art
```

Each time round, `subject` holds the next key, as a text. The keys come in the order they were added to the object.

## The value of each key

`report.maths` reads the key called `maths`. But inside the loop, the key's name is in a variable, `subject`. To read the key whose name is **in** a variable, use square brackets:

```js
for (const subject in report) {
  console.log(`${subject}: ${report[subject]}`);
}
```

```text
maths: 9
English: 8
art: 10
```

`report[subject]` means: the value of the key that `subject` holds. The first time round, that's `report["maths"]`, which is 9.

Square brackets also make a key whose name is in a variable, or has spaces in it: `report["music class"] = 7` adds a key called `music class`. That's how you build an object from a page, where the keys come from the page's text.

## `for...in` or `for...of`?

- `for...of` goes through the **items of an array**: `for (const fruit of fruits)`.
- `for...in` goes through the **keys of an object**: `for (const subject in report)`.

## Break it on purpose

Use the dot with the variable:

```js
for (const subject in report) {
  console.log(`${subject}: ${report.subject}`);
}
```

```text
maths: undefined
English: undefined
art: undefined
```

`report.subject` looks for a key called exactly "subject", and the report has none. Only square brackets read what's inside the variable.

Then use `for...of` on the object: the console says `TypeError: report is not iterable`. An object isn't a list of items, so `for...of` doesn't know how to go through it.

---

## Mission: The cards as an object

Later lessons will work on the dashboard's numbers, so the script should first gather them in one object.

**Example**: the console shows a line for each card, in the cards' order:

```text
Crew on board: 6
Oxygen: 98%
Water: 1,240 litres
Next launch: Friday
Power: 87%
Days in orbit: 412
```

- The script makes an object of the cards: for each card of `.stats`, a key that is the card's heading, with the card's number (`.stat-value`) as its value.
- It goes through the object's keys and logs, for each one, the key, `: `, and its value.

Psst, a key in a variable needs square brackets, not a dot :)
