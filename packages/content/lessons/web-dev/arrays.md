A shopping list isn't one thing: it's milk, bread and apples, in a row. You could keep each in its own variable, `item1`, `item2`, `item3`... but what if the list has 30 things? JavaScript has one value that holds a whole list: an **array**.

## Making an array

An array is written in square brackets, with commas between the values:

```js
const shopping = ["milk", "bread", "apples"];
console.log(shopping);
```

```text
["milk", "bread", "apples"]
```

One name, three values, in order. An array can hold numbers too, or a mix: `[3, 7, 12]`.

## Reading one item: its index

Each item has a number for its place, called its **index**. And here's the surprise: counting starts at **0**:

```js
console.log(shopping[0]);
console.log(shopping[1]);
console.log(shopping[2]);
```

```text
milk
bread
apples
```

`shopping[0]` is the first item, `shopping[1]` the second. Think of a building's ground floor: in many countries it's floor 0, and the first floor is one up.

## The number of items

Like a string, an array has a `length`:

```js
console.log(shopping.length);
```

```text
3
```

So the **last** item is always at `length - 1`: here, `shopping[2]`. Counting from 0 means the last index is one less than the number of items.

## Break it on purpose

Ask for the item at the length:

```js
console.log(shopping[3]);
```

```text
undefined
```

There's no fourth item. `undefined` is JavaScript's word for "there's nothing there". When you get it, check your index: it's usually one too many.

---

## Mission: The shifts

The station runs three shifts a day: Morning, Day and Night, in that order.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
First shift: Morning
Last shift: Night
```

- In `crew.js`, the three shifts are kept in one array, in that order.
- The console shows `First shift: Morning` and `Last shift: Night`, each read from the array by its index.

Psst, the first item's index is 0 :)
