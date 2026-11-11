Hover over a button in many apps and a little label pops up: "Save", "Delete". That label is an attribute, `title`, and a script can write attributes like that, or read them, just as it writes text.

## `getAttribute`

```js
const link = document.querySelector("#rules-link");
console.log(link.getAttribute("href"));
```

```text
rules.html
```

`getAttribute` gives the value of an attribute, as a string, exactly as written in the HTML. An attribute that isn't there gives `null`.

## `setAttribute`

```js
link.setAttribute("title", "Read the club rules");
```

Two things in the brackets: the attribute's name, then its value. If the attribute exists, its value is replaced. If not, it's added. Hover over the link, and the label pops up.

It works for any attribute: `alt` on a picture, `href` on a link, `title` on anything.

## Break it on purpose

Give only one thing to `setAttribute`:

```js
link.setAttribute("title");
```

```text
TypeError: Failed to execute 'setAttribute': 2 arguments required, but only 1 present.
```

A name **and** a value, every time. And reading with `getAttribute("titel")`, misspelled, gives `null`: check the name first when an attribute seems to be missing.

---

## Mission: Labels on the codes

A flight code like SL-104 doesn't say much on its own. Hovering over it should say where the flight goes.

**Example**: hover over SL-104 in the flight table, and a label pops up:

```text
Flight SL-104 to Lunar Gateway
```

- Every flight code cell of the table gets a `title` attribute, written by the script: `Flight `, the code, `to` and the destination of its row.
- The code and the destination are read from the row's cells.

Psst, `setAttribute` takes a name and a value :)
