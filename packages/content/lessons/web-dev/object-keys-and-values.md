Look at the table of contents of a book: a list of the chapter names, without the chapters. Or think of a list of just the page numbers. Sometimes you don't need the whole book, only one of its two lists. An object can give you its keys as a list, or its values.

## `Object.keys`: the keys as an array

`Object.keys` takes an object and gives back an array of its keys:

```js
const pets = { cat: "Tom", dog: "Rex", fish: "Bubbles" };

console.log(Object.keys(pets));
```

```text
["cat", "dog", "fish"]
```

It's written a bit differently from the methods you know: not `pets.keys()`, but `Object.keys(pets)`, with the object between the brackets. `Object` with a capital O is the same for every object, and it holds these helpers.

## `Object.values`: the values as an array

`Object.values` gives the values, in the same order:

```js
console.log(Object.values(pets));
```

```text
["Tom", "Rex", "Bubbles"]
```

## Everything an array can do

The answer is a real array, so everything you know about arrays works on it:

```js
const keys = Object.keys(pets);

console.log(`${keys.length} pets`);
console.log(`We have a ${keys.join(", a ")}`);
console.log(Object.values(pets).includes("Rex"));
```

```text
3 pets
We have a cat, a dog, a fish
true
```

`length` counts the keys, `join` makes a line of them, `includes` looks for a value. An object has none of these itself.

## Break it on purpose

Ask the object itself how many keys it has:

```js
console.log(pets.length);
```

```text
undefined
```

An object has no `length`: `pets.length` looks for a key called "length", and there is none. Count the keys with `Object.keys(pets).length`. And putting the object in a text gives `[object Object]`, never its values: turn it into an array first, then `join` it.

---

## Mission: About the numbers

Under the cards, the dashboard should say how many numbers it shows, which ones, and all their values in one line.

**Example**: under the cards, the dashboard says:

```text
6 numbers on the dashboard
Numbers for: Crew on board, Oxygen, Water, Next launch, Power, Days in orbit
Values: 6 / 98% / 1,240 litres / Friday / 87% / 412
```

- Under the cards, before the week, three paragraphs with the ids `stat-count`, `stat-names` and `stat-values`, in this order.
- `#stat-count` says how many keys the object of the cards has, then ` numbers on the dashboard`.
- `#stat-names` says `Numbers for: ` and the object's keys, with a comma and a space between two. `#stat-values` says `Values: ` and its values, with ` / ` between two.

Psst, an object has no `length`, but the array of its keys has :)
