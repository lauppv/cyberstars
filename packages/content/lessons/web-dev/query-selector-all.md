A teacher calls the register: not just the first pupil, but every one of them. `querySelector` finds only the **first** element that matches. To find them all, there's a second tool.

## `querySelectorAll`

```js
const members = document.querySelectorAll("#members li");
console.log(members.length);
```

```text
4
```

`querySelectorAll` takes a selector, just like `querySelector`, and gives you **every** element that matches, in the order they are on the page. `"#members li"` picks every `li` inside the element with the id `members`.

What you get works like an array: it has a `length`, and its items have indexes from 0:

```js
console.log(members[0].textContent);
```

```text
Sam Green
```

## Counting what's on the page

That's the big use: the page itself says how many there are. Add a member to the HTML, and the script counts one more, without changing a line of JavaScript.

```js
const count = document.querySelectorAll(".card").length;
document.querySelector("#total").textContent = `${count} cards`;
```

## Nothing found

If nothing matches, you don't get `null` like `querySelector` gives: you get an empty list, with a `length` of 0.

## Break it on purpose

Use `querySelector` by mistake:

```js
const members = document.querySelector("#members li");
console.log(members.length);
```

```text
undefined
```

`querySelector` gave just the first `li`, one element, which has no length. One letter short of `All`, and the count is gone.

---

## Mission: Count the crew

The number of crew members should come from the crew list itself, not from a number you type.

**Example**: `crew.html` shows, under the crew list:

```text
4 crew members on board
```

- Under the crew list, a paragraph with the id `roster`.
- The script writes in it how many items the crew list has, followed by ` crew members on board`.
- Add a name to the list, and the number changes too.

Psst, `All`, and only the items inside `#crew` :)
