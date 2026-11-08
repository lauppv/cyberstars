Your rows get their `delayed` and `cancelled` classes from the HTML, written by hand. But the status is right there in each row: the script can read it and give each row its class itself. Then a status changed in one place, the cell, changes the row's look too.

## Attributes

```js
const link = document.querySelector("#manual");
link.getAttribute("href"); // "manual.html"
link.setAttribute("href", "manual-v2.html");
link.hasAttribute("target"); // false
link.removeAttribute("title");
```

`getAttribute` reads any attribute as a string (or `null` when it's missing), `setAttribute` writes one.

## classList

Classes have a tool of their own, `classList`:

```js
row.classList.add("selected");
row.classList.remove("selected");
row.classList.toggle("selected"); // add if missing, remove if there
row.classList.contains("selected"); // true or false
```

That's the usual way for a script to change a page's look: the script says **what** an element is now, with a class, and CSS says **how** that looks. Setting `style` properties from the script mixes the two and is harder to change later.

## A button that stays pressed

A button that switches something on and off should say whether it's on. `aria-pressed` does that for a screen reader: `"true"` when pressed, `"false"` when not. Keep it in step with what the button does:

```js
button.setAttribute("aria-pressed", String(isOn));
```

---

## Mission: Status Classes

- Take the `delayed` and `cancelled` classes off the rows in the HTML. In `schedule.js`, give every row whose status is `Delayed` the class `delayed`, and every `Cancelled` one the class `cancelled`, read from its status cell.
- Over the flights table, add a button with the id `hide-cancelled` that says **Hide cancelled**, with `aria-pressed="false"`.
- A click toggles the class `hide-cancelled` on the flights table; in your CSS, a cancelled row inside a table with that class isn't shown at all. The button then says **Show cancelled** and is pressed; a second click brings everything back.
