When you sign up for a game, the username box sometimes says "at least 6 characters". And on an airport screen, names often show in capitals: SAM GREEN. Both need a program to know something about a string: how long it is, or what it looks like in capitals.

## `.length`

Every string knows how many characters it has:

```js
const name = "Sam Green";
console.log(name.length);
```

```text
9
```

The dot means "of": `name.length` is "the length of `name`". It counts every character, spaces included: S, a, m, space, G, r, e, e, n make 9.

`length` is a **property** of the string, a fact about it. No brackets after it.

## `.toUpperCase()` and `.toLowerCase()`

```js
console.log(name.toUpperCase());
console.log(name.toLowerCase());
```

```text
SAM GREEN
sam green
```

These are **methods**: things a string can **do**. A method has brackets after its name, `()`, even when there's nothing to put in them. They give you a new string, in capitals or small letters. The original `name` stays exactly as it was.

## Break it on purpose

Forget the brackets:

```js
console.log(name.toUpperCase);
```

```text
function toUpperCase()
```

Not SAM GREEN: the console shows the method itself, not its result. A method only does its job with `()`. And it's the other way round for `length`: `name.length()` is an error, because a property isn't something you call.

---

## Mission: Badge and form

Lena Park needs a badge, with her name in capitals, and the crew form asks how many characters her full name has.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
Badge: LENA PARK
Letters in the name: 9
```

- The console shows `Badge: LENA PARK`, made from her full name with a method, not typed in capitals.
- The console shows `Letters in the name: 9`, counted from her full name.

Psst, a property has no brackets, a method does :)
