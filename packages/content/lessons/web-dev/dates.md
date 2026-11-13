Your phone says "Good morning" when you open it before lunch, and shows today's date on the lock screen. It knows what time it is. A page's script can know it too, and use it: greet the visitor, or mark today on a calendar.

## `new Date()`: now

`new Date()` makes a **date**: a value that holds a day and a time to the millisecond. With nothing between its brackets, it's right now:

```js
const now = new Date();
console.log(now);
```

The console shows something like `Wed May 14 2031 09:30:00 GMT+0000`. Run it again a minute later, and the minutes have moved: it's always the moment the line runs.

## The parts of a date

A date has methods that each give one part of it, as a number:

```js
const now = new Date();

console.log(now.getFullYear());
console.log(now.getMonth());
console.log(now.getDate());
console.log(now.getHours());
console.log(now.getMinutes());
console.log(now.getDay());
```

On Wednesday 14 May 2031 at 9:30, it shows:

```text
2031
4
14
9
30
3
```

Some of them count in an odd way:

- `getMonth` counts the months **from 0**: January is 0, so May is 4. Add 1 to get the month a person would say.
- `getDate` is the day of the month, 14. `getDay` is the day of the **week**: 0 for Sunday, 1 for Monday, up to 6 for Saturday. So Wednesday is 3.
- `getHours` goes from 0 to 23: 9 in the morning is 9, 9 in the evening is 21.

## Using the hour

An `if` on the hour gives a page that changes through the day:

```html preview
<p id="hello"></p>
<script>
  const hour = new Date().getHours();
  const hello = document.querySelector("#hello");
  if (hour < 12) {
    hello.textContent = "Good morning!";
  } else {
    hello.textContent = "Good day!";
  }
</script>
```

Depending on when you read this, the page says one or the other.

## A week that starts on Monday

`getDay` starts the week on Sunday, 0. A list of days that starts on Monday has Monday at index 0 and Sunday at index 6. To go from one to the other, add 6 and keep the remainder of a division by 7 with `%`:

```text
Monday     getDay 1  →  (1 + 6) % 7 = 0
Wednesday  getDay 3  →  (3 + 6) % 7 = 2
Sunday     getDay 0  →  (0 + 6) % 7 = 6
```

## Break it on purpose

Use `getDate` where you mean `getDay`. On the 14th of the month, `getDate` is 14, and `(14 + 6) % 7` is 6: Sunday, on a Wednesday. Nothing warns you, since both are numbers. Then print `getMonth()` for May: 4, not 5. When a date is one off, look for the parts that count from 0.

---

## Mission: Good morning, crew

The dashboard should greet the crew for the time of day, and show which day of the week it is today.

**Example**: on a Wednesday at 9:30, under the dashboard's first line, it says:

```text
Good morning, crew
```

and Wednesday stands out in the week, in another color.

- Under the dashboard's first paragraph, a paragraph with the id `greeting`.
- Before 12:00 it says `Good morning, crew`, from 12:00 to before 18:00 `Good afternoon, crew`, and from 18:00 `Good evening, crew`.
- Today's day in the week gets the class `today`, and only that one. It looks different from the other days, by its background or its color.

Psst, `getDay` gives 0 on a Sunday, but Sunday is the last day of your week :)
