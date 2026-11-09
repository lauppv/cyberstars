A shopping list changes: you remember the eggs and add them at the bottom, or you cross off the last thing because you already have it. Arrays can change the same way, at their end.

## `push`: add to the end

```js
const shopping = ["milk", "bread"];
shopping.push("eggs");
console.log(shopping);
console.log(shopping.length);
```

```text
["milk", "bread", "eggs"]
3
```

`push` is a method, so it has brackets, and the new item goes inside them. The array grows by one, and its `length` follows.

## `pop`: take the last one off

```js
const last = shopping.pop();
console.log(last);
console.log(shopping);
```

```text
eggs
["milk", "bread"]
```

`pop` takes the last item off the array, and gives it to you, in case you want to use it. The array is one shorter.

## `const` arrays can still change

Wait: `shopping` is a `const`, and it changed? A `const` can't be given another value: you can't write `shopping = ["tea"]`. But the array itself, the list inside, can still grow and shrink. The name always points at the same list. Only what's on the list changes.

## Break it on purpose

Put the item in the wrong place:

```js
shopping.push();
shopping.push = "eggs";
```

The first line adds nothing: `undefined` goes on the end. The second breaks `push` itself, so the next `push` gives an error. A method is **called**, with the value in its brackets: `shopping.push("eggs")`.

---

## Mission: An evening shift

The station adds a fourth shift, then changes its mind.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Shifts: 4
Cancelled: Evening
Shifts: 3
```

- An `Evening` shift is added to the end of your shifts array, and the console shows `Shifts: 4`, counted from the array.
- Then the last shift is taken off, and the console shows `Cancelled: Evening`, with the shift it took off.
- Then it shows `Shifts: 3`, counted again.

Psst, `pop` gives you back what it takes off :)
