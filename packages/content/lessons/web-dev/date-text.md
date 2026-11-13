Nobody writes "2031, month 4, day 14" on a birthday card. We write "Wednesday, May 14" in words, the way people read dates. Gluing a date's numbers together yourself is a lot of work. Dates have methods that write them for people.

## `toLocaleDateString`

`toLocaleDateString` gives the date as a text, the way people of a language write it. The first thing in its brackets is the language, as a short code: `"en-US"` is English as it's written in the United States:

```js
const day = new Date();
console.log(day.toLocaleDateString("en-US"));
```

On 14 May 2031, it shows:

```text
5/14/2031
```

Short, with the month first, as Americans write it. `"en-GB"`, English as written in Britain, gives `14/05/2031`, the day first.

## Choosing the parts

The second thing in the brackets is an object that says which parts to write, and how:

```js
console.log(
  day.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);
```

```text
Wednesday, May 14, 2031
```

Each key is a part of the date, and its value says how to write it: `"long"` is the whole word (Wednesday, May), `"short"` a short one (Wed, May), and `"numeric"` a number. A part you leave out isn't written. The browser puts the commas and the order in, as the language wants.

## `toLocaleTimeString`

`toLocaleTimeString` does the same for the time:

```js
console.log(day.toLocaleTimeString("en-US"));
console.log(day.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
```

At half past nine in the morning, it shows:

```text
9:30:00 AM
9:30 AM
```

`"2-digit"` writes a number with at least two digits: 9:05, never 9:5. In American English, the hours go from 1 to 12, with AM before noon and PM after it.

## Break it on purpose

Build the time yourself: `` `${day.getHours()}:${day.getMinutes()}` ``. At 9:05, you get `9:5`: `getMinutes` gives the number 5, with no 0 in front. And in the evening it says `21:5`, not `9:05 PM`. Let `toLocaleTimeString` do it: it knows how each language writes a time.

---

## Mission: Today's date

Under the greeting, the dashboard should show today's date in words, and the time it was last updated.

**Example**: on Wednesday 14 May 2031 at 9:30 in the morning, under the greeting, it says:

```text
Wednesday, May 14, 2031
Last update: 9:30 AM
```

- Under `#greeting`, a paragraph with the id `today-date`, then one with the id `last-update`.
- `#today-date` shows today's date as American English writes it in full: the day of the week, the month in words, the day and the year, as in the example.
- `#last-update` says `Last update: `, then the time as American English writes it, with the hour, the minutes in two digits, and AM or PM.

Psst, the parts you want go in an object, after the language :)
