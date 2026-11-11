Remember how you gave rows the classes `delayed` and `cancelled` by hand? Every time a flight changes, someone would have to edit the HTML. A script can read each row's status and give it the right class itself.

## `classList`

Every element has a `classList`: its list of classes, with methods to change it.

```js
const row = document.querySelector("#game-1");
row.classList.add("winner");
```

`add` gives the element the class, keeping the classes it already has. The page changes at once: every CSS rule for `.winner` now applies to it.

```js
row.classList.remove("winner");
```

`remove` takes it away, and leaves the other classes alone.

```js
console.log(row.classList.contains("winner"));
```

```text
false
```

`contains` asks whether the element has the class: `true` or `false`.

## Why not `setAttribute("class", ...)`?

You could, but `setAttribute("class", "winner")` **replaces** all the classes with just that one. `classList` adds and removes one class at a time, without touching the others.

## Break it on purpose

Write the class with a dot:

```js
row.classList.add(".winner");
```

The row gets a class called `.winner`, with the dot, which no CSS rule matches. As in the HTML, the dot is only for selectors.

---

## Mission: Classes from the status

The script gives each row its class from its status, so the HTML doesn't need them any more.

**Example**: the table looks the same as before. But now, if a flight's status changes in the HTML, for example SL-105 to `Delayed`, its row turns amber by itself.

- For every row of the flight table's body, the script adds the class `delayed` when its status is `Delayed`, and the class `cancelled` when its status is `Cancelled`.
- A row whose status is neither gets neither class.

Psst, the dot is only for selectors :)
