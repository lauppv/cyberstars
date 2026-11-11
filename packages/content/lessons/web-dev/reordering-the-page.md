Sorting a list in your script doesn't change what visitors see: the table on the page stays in its old order. To put the page itself in a new order, the script has to move the rows.

## `append` moves an element

You used `append` to add a new element at the end of another. If the element is already on the page, `append` doesn't copy it: it **moves** it to the end.

```js
const list = document.querySelector("#games");
const first = list.querySelector("li");
list.append(first);
```

The first game jumps to the end of the list. Nothing is copied, nothing is lost.

## Rows in a new order

So to reorder a table: sort the rows, then append each one, in the new order, to the table's body:

```js
function byPoints(a, b) {
  return Number(b.querySelector(".points").textContent) - Number(a.querySelector(".points").textContent);
}

const body = document.querySelector("#scores tbody");
const rows = Array.from(body.querySelectorAll("tr"));
rows.sort(byPoints);
for (const row of rows) {
  body.append(row);
}
```

Step by step:

- `Array.from(...)` turns what `querySelectorAll` gives into a real array, because only real arrays have `sort`;
- the rows are sorted with a comparator that reads each row's cell;
- each row, in the new order, is appended to the body: the first goes to the end, then the second after it, and so on. When the loop ends, they stand in the sorted order.

## On a click

Put it in a function and hand it to a button, and visitors can sort the table themselves.

## Break it on purpose

Forget `Array.from`:

```js
const rows = body.querySelectorAll("tr");
rows.sort(byPoints);
```

```text
TypeError: rows.sort is not a function
```

What `querySelectorAll` gives looks like an array, with a `length` and indexes, but it isn't one, and has no `sort`. `Array.from` makes it one.

---

## Mission: Sort by time

Passengers want to see the flights in the order they leave.

**Example**: over the flight table, a button says `Sort by time`. A click puts the rows of the table's body in order of departure, earliest first: SL-103, SL-101, SL-102, SL-105, SL-104.

- A button with the id `sort-by-time`, saying `Sort by time`.
- A click reorders the rows of the flight table's body by their departure time, earliest first.
- The rows themselves move: nothing is copied, and every row keeps its classes.

Psst, `append` moves an element that's already on the page :)
