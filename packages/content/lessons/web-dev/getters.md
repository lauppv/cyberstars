Your age isn't written anywhere on you. It's worked out from your birthday, every time someone asks. Next year the answer changes, though nobody wrote a new number down. Some values are like that: better worked out when asked than kept.

## A value that's really a method

A **getter** is a method you read like a value. Write `get` in front of it, and leave out the brackets when you use it:

```js
class Pupil {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }

  get fullName() {
    return `${this.first} ${this.last}`;
  }
}

const mia = new Pupil("Mia", "Pop");
console.log(mia.fullName);
mia.last = "Ionescu";
console.log(mia.fullName);
```

```text
Mia Pop
Mia Ionescu
```

`mia.fullName` looks like a value, but runs the method each time it's read, so it always fits the other values. Kept in the constructor instead, `this.fullName = ...` would still say "Mia Pop" after the change.

## When to use one

Use a getter for a value that comes from the object's other values, where reading it shouldn't change anything. A name put together, a total, an answer to a yes-or-no question. Use a method, with brackets, for something that does a job.

## Break it on purpose

Read a getter with brackets: `mia.fullName()`. The browser says `mia.fullName is not a function`: what it reads is a text, and a text can't be called. Then write the getter without `return`: every read gives `undefined`.

---

## Mission: Call signs

Every crew member has a call sign for the radio: the first three letters of their name, in capitals. Rest the mouse on a person in the crew panel, and their call sign should show.

**Example**: rest the mouse on `★ Vega, Commander`, and a box says `VEG`. Orion's says `ORI`.

- `CrewMember` has a getter `callSign` that gives the first three letters of the member's name, in capitals, worked out when it's read, so it fits a new name too.
- Each line of the crew panel gets the person's call sign as its `title`.

Psst, a getter is read without brackets :)
