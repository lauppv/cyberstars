A contact on your phone isn't one value: it's a name, a number, a birthday, all about the same person. You could keep each in its own variable, but they belong together. JavaScript keeps things that belong together in an **object**.

## Making an object

An object is written in curly brackets, with a **name** and a **value** for each piece, separated by commas:

```js
const friend = {
  name: "Sam",
  age: 13,
  city: "Bristol",
};
```

Each `name: value` pair is a **property**. The names have no quotes, the values are any values you like: strings, numbers, booleans.

## Reading a property

A dot, then the property's name:

```js
console.log(friend.name);
console.log(`${friend.name} is ${friend.age}`);
```

```text
Sam
Sam is 13
```

You've used dots like this before: `name.length`, `element.textContent`. A string and an element are objects too, with properties of their own.

## Logging it all

```js
console.log(friend);
```

```text
{name: "Sam", age: 13, city: "Bristol"}
```

## Break it on purpose

Ask for a property that isn't there:

```js
console.log(friend.phone);
```

```text
undefined
```

No error, just `undefined`, "nothing there". A typo in a property's name gives the same `undefined`, which can be hard to spot: check the spelling.

---

## Mission: The next flight

The schedule's script keeps the next flight's details together, in one object.

**Example**: when `schedule.html` opens, the console shows:

```text
Next flight: SL-102 to Mars Relay at 09:45
```

- In `schedule.js`, one object holds the flight's `code`, `destination` and `departs`: `SL-102`, `Mars Relay` and `09:45`.
- The console shows `Next flight: SL-102 to Mars Relay at 09:45`, read from the object's properties.

Psst, a dot reads a property :)
