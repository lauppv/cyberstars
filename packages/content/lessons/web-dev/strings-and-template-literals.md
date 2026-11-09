On a name badge at a party, someone writes your first name, a space, and your last name. Two pieces of text stuck together. Programs stick text together all the time: a greeting and a name, a label and a number.

## Strings

A piece of text in JavaScript is a **string**, written in quotes, double or single:

```js
const firstName = "Sam";
const lastName = 'Green';
```

Both kinds work the same. Just start and end with the same kind.

## Joining with `+`

`+` between two strings sticks them together into one:

```js
const fullName = firstName + " " + lastName;
console.log(fullName);
```

```text
Sam Green
```

Notice the `" "` in the middle: a string with just a space in it. Without it, you'd get `SamGreen`. JavaScript never adds a space by itself.

You can join a label and a variable the same way:

```js
console.log("Member: " + fullName);
```

```text
Member: Sam Green
```

## Strings and numbers

`+` also adds numbers. So what happens when you mix them?

```js
console.log("Table " + 4);
console.log(2 + 2);
console.log("2" + "2");
```

```text
Table 4
4
22
```

With a string on either side, `+` joins: the number becomes text and is stuck on. With two numbers, it adds. `"2" + "2"` is two strings, so you get `22`, not 4. Keep an eye on quotes.

## Break it on purpose

Forget the space:

```js
console.log("Member:" + fullName);
```

```text
Member:Sam Green
```

Squashed together. Spaces only appear where you put them, inside the quotes.

---

## Mission: A new arrival

A new crew member arrives: her first name is `Lena` and her last name is `Park`.

**Example**: when `crew.html` opens, the console shows, among its other lines:

```text
New arrival: Lena Park
```

- In `crew.js`, her first name and her last name are kept under two names.
- The console shows `New arrival: Lena Park`, joined from those two with `+`.

Psst, a space is a string too: `" "` :)
