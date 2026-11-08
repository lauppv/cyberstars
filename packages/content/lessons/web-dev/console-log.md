A script works where you can't see it. To find out what it's doing, you make it talk: `console.log` writes a line in the **console**.

## The console

Every browser has a console, hidden in its developer tools: press **F12** (or **⌘+⌥+I** on a Mac) on any website. Here, it's under the preview, and it shows the same thing.

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

- Text is called a **string**, and it goes in quotes: `"Docking bay ready"`. Single quotes work too.
- A **number** goes without quotes: `40`.
- Several values with commas between them come out on one line, with a space between them.

Each line of code here is a **statement**: an order for the browser. It ends with `;`.

## Errors

When the browser can't understand or run a line, it stops the script there. It writes an **error** in the console, in red, with the number of the line. Read it: it's the quickest way to find what's wrong. Common causes: a missing quote, a name spelled wrong, or `console.log` written as `Console.log`. JavaScript cares about capital letters.

## Comments

```js
// A comment on one line
/* A comment
   on several lines */
```

The browser skips them, just like HTML's `<!-- -->`.

`console.log` is your best friend when you write JavaScript. Whenever you're not sure what a value is, log it.

---

## Mission: System Check

When the page opens, the station reports to its engineer in the console. Keep your line along the top, and under it, in `script.js`, make the console show these three lines, in this order:

```text
Station Log online
92
Crew on board: 6
```

The `92` is how many minutes one trip around the Earth takes. It's a number, not text: look at how the console shows it.
