You empty your pockets into a piggy bank, one coin at a time. Before the first coin, the bank holds 0. Each coin adds to what's already inside. At the end, many coins have become one number: how much you saved. `reduce` turns an array into one value the same way.

## Adding up with a loop

You know how to add up an array in a loop: a variable starts at 0, and each item is added to it:

```js
const coins = [2, 5, 1, 10];
let saved = 0;
for (const coin of coins) {
  saved = saved + coin;
}
console.log(saved);
```

```text
18
```

## `reduce`

`reduce` does that loop for you. It takes two things: a function, and the value to start from:

```js
const coins = [2, 5, 1, 10];
const saved = coins.reduce((total, coin) => total + coin, 0);

console.log(saved);
```

```text
18
```

The function gets two parameters: what has piled up so far, `total`, and the next item, `coin`. What it returns becomes the new `total` for the next item. Step by step:

```text
total 0,  coin 2   →  2
total 2,  coin 5   →  7
total 7,  coin 1   →  8
total 8,  coin 10  →  18
```

After the last item, `reduce` gives back the last total: 18. The `0` at the end of the line is where `total` starts, like `let saved = 0` in the loop.

## Adding up objects

With an array of objects, the function picks the number out of each one:

```js
const lunch = [
  { food: "sandwich", price: 4 },
  { food: "juice", price: 2 },
  { food: "apple", price: 1 },
];
const bill = lunch.reduce((total, item) => total + item.price, 0);

console.log(`To pay: ${bill}`);
console.log(`Average price: ${bill / lunch.length}`);
```

```text
To pay: 7
Average price: 2.3333333333333335
```

An average is the total divided by how many there are. To show it nicely, round it, with `Math.round` from the Crew Directory.

## Break it on purpose

Forget the start, `0`, with the objects:

```js
const bill = lunch.reduce((total, item) => total + item.price);
console.log(bill);
```

```text
[object Object]21
```

Without a start, `reduce` starts with the **first item**: the whole sandwich object. JavaScript can't add a number to an object, so it turns both into texts, and the result is nonsense. Always give `reduce` its start: `0` for a sum.

---

## Mission: The average level

Under the low supplies, the crew wants one number for all of them: how full the supplies are, on average.

**Example**: under `#low-supplies`, the dashboard says:

```text
Supplies at 50% on average
```

- Under `#low-supplies`, a paragraph with the id `supplies-average`.
- It says `Supplies at `, then the average level of all the supplies of the table, rounded to a whole number, then `% on average`.
- The average is the total of the levels, divided by how many supplies there are.

Psst, `reduce` needs its start, after the function :)
