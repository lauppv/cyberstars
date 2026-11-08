A script works out of sight. To see what it's doing, you make it talk: `console.log` writes a line to the **console**.

## The console

Every browser has one, hidden in its developer tools: press **F12** (or **⌘+⌥+I** on a Mac) on any website. Here it sits under the preview, and shows the same thing.

```js
console.log("Docking bay ready");
console.log(40);
console.log("Crates:", 40);
```

```text
Docking bay ready
40
Crates: 40
```

- Text, a **string**, goes in quotes: `"Docking bay ready"`. Single quotes work too.
- A **number** goes without quotes: `40`.
- Several values, separated by commas, come out on one line with a space between them.

Each line of code here is a **statement**, an order to the browser, and ends with `;`.

## Errors

When the browser can't understand or run a line, it stops the script there and writes an **error** to the console, in red, with the line it happened on. Read it: it's the quickest way to find what's wrong. A missing quote, a misspelled name, `console.log` written `Console.log`: JavaScript cares about capital letters.

## Comments

```js
// A comment on one line
/* A comment
   on several lines */
```

The browser skips them, as it skips HTML's `<!-- -->`.

`console.log` is your best friend while you write JavaScript. Log a value whenever you're not sure what it is.

---

## Mission: System Check

Keep the gold line, and under it, in `script.js`, make the station report in the console:

- the line `Station Log online`;
- the number of minutes the station takes to go round the Earth, `92`, as a number;
- with one `console.log` and two values, the line `Crew on board: 6`.
