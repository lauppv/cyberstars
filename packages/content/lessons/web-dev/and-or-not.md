"You can go out if you've done your homework **and** tidied your room." "We'll take the bus **or** a taxi." "Do **not** touch." Everyday rules join questions together with and, or and not. JavaScript has the same three words, written as signs.

## `&&`: and

Both sides must be true:

```js
const homeworkDone = true;
const roomTidy = false;
console.log(homeworkDone && roomTidy);
```

```text
false
```

The room isn't tidy, so the whole answer is `false`. `&&` is `true` only when **both** are.

## `||`: or

At least one side must be true:

```js
const busComing = false;
const taxiFree = true;
console.log(busComing || taxiFree);
```

```text
true
```

The bus isn't coming, but a taxi is free, so you can go: `true`. `||` is `false` only when **both** are false. The `|` key is usually above Enter, typed with Shift.

## `!`: not

`!` turns `true` into `false` and back:

```js
const raining = false;
console.log(!raining);
```

```text
true
```

"Not raining" is true.

## Joining questions

They're often used with comparisons:

```js
const age = 13;
console.log(age >= 12 && age <= 18);
```

```text
true
```

"At least 12 and at most 18": a teenager.

## Break it on purpose

Use one `&` or one `|`:

```js
console.log(homeworkDone & roomTidy);
```

```text
0
```

A number, not a boolean! A single `&` is something else entirely, for working with the bits of numbers. For "and" and "or", always two signs.

---

## Mission: Ready to fly

A flight is ready for its passengers when it's on time **and** leaves before 10:00.

**Example**: when `schedule.html` opens, the console shows:

```text
Second flight ready: true
```

- The console shows `Second flight ready: ` followed by `true` or `false`.
- It's `true` only when the second row's status is `On time` and its departure time is before `10:00`, both read from the table.

Psst, "and" is two `&` :)
