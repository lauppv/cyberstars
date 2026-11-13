"How many sleeps until my birthday?" Little children ask it every evening. To answer, you count the days from today to the birthday on the calendar. A script can count them too, by taking one date away from another.

## A date from a text

`new Date()` with nothing in its brackets is now. With a text like `"2031-05-17"`, the way a date field writes a date, it's that day, at midnight:

```js
const birthday = new Date("2031-05-17");
console.log(birthday.getDate());
```

```text
17
```

## One date minus another

Take one date away from another, and you get a number: how many **milliseconds** are between them. A millisecond is a thousandth of a second:

```js
const start = new Date("2031-05-14");
const end = new Date("2031-05-17");

console.log(end - start);
```

```text
259200000
```

That's a big number, because there are many milliseconds in a day: 1000 in a second, 60 seconds in a minute, 60 minutes in an hour, 24 hours in a day. Multiply them, and divide by that:

```js
const dayLength = 1000 * 60 * 60 * 24;
console.log((end - start) / dayLength);
```

```text
3
```

Three days between the 14th and the 17th.

## Counting from now

From **now**, the answer is rarely a whole number. At 9:30 on the 14th, the 17th is 2 days and 14 and a half hours away:

```js
const daysLeft = (new Date("2031-05-17") - new Date()) / dayLength;
console.log(daysLeft);
```

```text
2.6041666666666665
```

To count the day that has already started as a whole one, round **up**, with `Math.ceil`: 2.6 becomes 3. "In 3 days" is what people say.

## Break it on purpose

Take away the days of the month: `end.getDate() - start.getDate()`. From the 14th to the 17th, that's 3, and it seems right. But from 30 May to 2 June, it's 2 - 30 = -28. The days of the month start again at 1 every month. Subtract the whole dates, then divide: the milliseconds don't care about months.

---

## Mission: Days to the launch

The Next launch card says "Friday". The crew would rather know how many days are left.

**Example**: on 14 May 2031, with the launch on 17 May, the Next launch card says:

```text
Next launch
in 3 days
2031-05-17
```

- The Next launch card gets a paragraph with the class `launch-date`, which holds the launch's date written like `2031-05-17`.
- The script writes into the card's `.stat-value` how many days are left until that date, counted up: 2 days and a few hours make `in 3 days`.
- With 1 day left, it says `tomorrow`, and on the day itself, `today`.
- The console's line for the Next launch card shows the new text too, like `Next launch: in 3 days`, so the days are written before the cards are gathered into their object.

Psst, a day is `1000 * 60 * 60 * 24` milliseconds :)
