At a bakery, a tray of plain biscuits goes into a machine that puts chocolate on each one. Out comes a new tray: the same number of biscuits, in the same order, each one changed the same way. `map` is that machine for arrays.

## Changing every item with a loop

To get the prices of a menu with a 10% discount, we'd write a loop that builds a new array:

```js
const prices = [20, 50, 10];
const sale = [];
for (const price of prices) {
  sale.push(price * 0.9);
}
console.log(sale);
```

```text
[18, 45, 9]
```

## `map`

`map` does that loop for you. You give it a function, and it calls the function on every item, in order. What the function returns becomes the item of the new array:

```js
const prices = [20, 50, 10];
const sale = prices.map((price) => price * 0.9);

console.log(sale);
console.log(prices);
```

```text
[18, 45, 9]
[20, 50, 10]
```

The function is the short arrow function you know: it takes one item, `price`, and returns `price * 0.9`. The new array always has as many items as the old one. And the old array stays as it was.

## Any change you like

The function can turn an item into anything, a text too:

```js
const pets = ["cat", "dog", "fish"];

console.log(pets.map((pet) => pet.toUpperCase()));
console.log(pets.map((pet) => `I have a ${pet}`));
console.log(pets.map((pet) => pet.length));
```

```text
["CAT", "DOG", "FISH"]
["I have a cat", "I have a dog", "I have a fish"]
[3, 3, 4]
```

A `map` often comes right before a `join`: first change every item, then make one line of them.

## Break it on purpose

Write the function with braces, and forget `return`:

```js
const loud = pets.map((pet) => {
  pet.toUpperCase();
});
console.log(loud);
```

```text
[undefined, undefined, undefined]
```

The function works out each word in capitals, then throws it away: with braces, a function returns nothing unless it says `return`. `map` still makes an array of three items, but each one is `undefined`. Write `return pet.toUpperCase();`, or leave out the braces, as in the short arrow function.

---

## Mission: Call signs

On the radio, the crew uses call signs: each name in capital letters, so nobody mixes them up.

**Example**: under the count of who is on duty, the dashboard says:

```text
Call signs: VEGA / ORION / LYRA / ALTAIR / NOVA / RIGEL
```

- Under `#duty-count`, a paragraph with the id `call-signs`.
- It says `Call signs: `, then each name of the duty list in capital letters, in the same order, with a `/` between two names, a space on each side.
- The other lines of the duty panel keep the names as they are written.

Psst, `map` gives you a new array, and leaves the old one as it was :)
