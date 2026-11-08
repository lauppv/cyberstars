Your rows get their `delayed` and `cancelled` classes from the HTML, typed by hand. But the status is right there in each row: the script can read it and give each row its class by itself. Then, when a status changes in one place, the cell, the row's look changes too.

## Attributes

```js
const link = document.querySelector("#manual");
link.getAttribute("href"); // "manual.html"
link.setAttribute("href", "manual-v2.html");
link.hasAttribute("target"); // false
link.removeAttribute("title");
```

`getAttribute` reads any attribute as a string (or `null` when it's missing), and `setAttribute` writes one.

## classList

Classes have a tool of their own, `classList`:

```js
row.classList.add("selected");
row.classList.remove("selected");
row.classList.toggle("selected"); // add if missing, remove if there
row.classList.contains("selected"); // true or false
```

That's the usual way for a script to change how a page looks. The script says **what** an element is now, with a class, and CSS says **how** that looks. Setting `style` properties from the script mixes the two, and is harder to change later.

## A button that stays pressed

A button that switches something on and off should say whether it's on. `aria-pressed` tells a screen reader: `"true"` when it's pressed, `"false"` when it isn't. Keep it matching what the button does:

```js
button.setAttribute("aria-pressed", String(isOn));
```

---

## Mission: Status Classes

The rows' classes should follow their status by themselves.

- Take the `delayed` and `cancelled` classes off the rows in your HTML. Your script gives every row whose status says `Delayed` the class `delayed`, and every row whose status says `Cancelled` the class `cancelled`, so the look from your style sheet still shows.
- Over the flights table, add a button with the id `hide-cancelled` that says **Hide cancelled**, and tells a screen reader it isn't pressed.
- A click hides every cancelled flight. Do it with a class on the table, `hide-cancelled`, and a rule in your style sheet, not with styles from the script. The button then says **Show cancelled** and tells a screen reader it's pressed. A second click brings everything back, and so on.
