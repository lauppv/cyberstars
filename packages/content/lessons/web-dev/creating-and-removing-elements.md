So far your scripts change what's **in** elements: their text. But the page can also grow: a chat app adds a new bubble for every message, a to-do app a new line for every task. The script makes a brand new element and puts it on the page.

## `createElement`: make one

```js
const item = document.createElement("li");
item.textContent = "darts";
```

`document.createElement("li")` makes a new, empty `li`, as if you'd written `<li></li>`. Then you fill it like any element. But it isn't on the page yet: it's floating in the script's memory, waiting to be put somewhere.

## `append`: put it on the page

```js
document.querySelector("#games").append(item);
```

`append` puts the new element **inside** another one, at its **end**. Now the `#games` list has one more item, at the bottom, and the page shows it.

Put the two together on a click:

```js
let added = 0;
document.querySelector("#add").addEventListener("click", () => {
  added = added + 1;
  const item = document.createElement("li");
  item.textContent = `New game ${added}`;
  document.querySelector("#games").append(item);
});
```

Each click makes a fresh `li`, "New game 1", "New game 2"... and adds it to the end.

## Break it on purpose

Make the element only once, outside the click:

```js
const item = document.createElement("li");
document.querySelector("#add").addEventListener("click", () => {
  item.textContent = "New game";
  document.querySelector("#games").append(item);
});
```

Click three times: only **one** new item. There's just one element, so each `append` moves the same one to the end again. Every new item needs its own `createElement`.

---

## Mission: Rookies

New rookies join the crew all the time. The crew directory gets a button to add them to the crew list.

**Example**: under the roster, a button says `Add a rookie`. Each click adds a new name at the end of the crew list: `Rookie 1`, then `Rookie 2`, and so on.

- A button with the id `add-rookie`, saying `Add a rookie`.
- Each click adds a new item at the end of the crew list, `#crew`: `Rookie 1` the first time, `Rookie 2` the second, and so on.

Psst, every new item needs its own `createElement` :)
