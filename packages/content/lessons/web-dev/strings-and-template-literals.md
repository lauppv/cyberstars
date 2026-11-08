Most of what a page shows is text. So most of what its scripts work with are **strings**.

## Joining strings

`+` between two strings sticks them together:

```js
const bay = "Cargo Bay";
console.log("Welcome to " + bay);
```

```text
Welcome to Cargo Bay
```

Watch the space: `"Welcome to" + bay` gives `Welcome toCargo Bay`. With two numbers, `+` adds them. With a string and a number, it sticks them together: `"Bay " + 2` is `"Bay 2"`.

## Template literals

Sticking many pieces together with `+` gets hard to read. A **template literal** is a string between backticks, `` ` ``, with values put right inside it:

```js
const crates = 40;
console.log(`${bay} holds ${crates} crates`);
```

```text
Cargo Bay holds 40 crates
```

`${ }` can hold any value, or a calculation: `` `${crates * 2} after the delivery` ``. It only works between backticks. Inside `"..."` or `'...'`, `${bay}` is just those six characters.

## What a string knows

A string has its own facts and tools. You reach them with a dot:

```js
bay.length; // 9, the number of characters, spaces included
bay.toUpperCase(); // "CARGO BAY"
bay.toLowerCase(); // "cargo bay"
```

`length` is a fact, so it has no parentheses. `toUpperCase()` is a tool, called a **method**, so it has them. The original string doesn't change: `toUpperCase()` gives you a new one.

## Quotes inside quotes

A string in double quotes can hold single quotes, and the other way round: `"Bay 2's door"`. Backticks can hold both.

---

## Mission: Greeting Board

The station might get a new name one day. When it does, the greeting screen should change by editing **one** line of your script. Under the crew count, in `script.js`, keep the station's name, `Station Log`, once, and build every one of these console lines from it:

```text
Welcome aboard Station Log
11
STATION LOG
```

The `11` is how many characters the name has, and the last line is the name in capital letters. Then one more line, built from your minutes per orbit:

```text
One orbit takes 92 minutes
```
