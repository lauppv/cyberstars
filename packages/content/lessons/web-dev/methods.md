A TV remote is one thing in your hand, and it has buttons that **do** things: turn on, turn up the volume, change the channel. The remote holds both: what it is, and what it can do. A JavaScript object can hold things it can do too.

## A function as a property

You know objects with values: `{ name: "Mia", age: 12 }`. A property's value can also be a function. A function that belongs to an object is called a **method**:

```js
const dog = {
  name: "Rex",
  bark() {
    console.log("Woof!");
  },
};

dog.bark();
```

```text
Woof!
```

`bark() { ... }` is the short way to write a method: its name, the brackets for its parameters, and its code in braces. Mind the comma after the closing brace, as after any property.

You call it with the object, a dot and the method's name, then the brackets: `dog.bark()`. You've used methods like this all along: `console.log()` is the method `log` of the object `console`, and `"hi".toUpperCase()` a method of texts.

## Methods with parameters

A method takes parameters like any function:

```js
const calculator = {
  double(number) {
    return number * 2;
  },
  greet(name) {
    console.log(`Hello, ${name}!`);
  },
};

console.log(calculator.double(21));
calculator.greet("Sara");
```

```text
42
Hello, Sara!
```

One object now holds a few things that belong together, each with a clear name. Instead of loose functions all over a script, you know where to look: everything about the calculator is in `calculator`.

## Break it on purpose

Forget the brackets when you call it: `dog.bark;`. Nothing happens, and nothing tells you why. Without `()`, you only name the method, you don't call it. Then call the object itself: `dog("Rex")`. The console says `TypeError: dog is not a function`: the object isn't a function, only its method is.

---

## Mission: The theme on the page

The settings page should say which theme is chosen. The code that writes it will grow, so it lives in an object from the start.

**Example**: under the theme buttons, the page says:

```text
Theme: system
```

Click the Dark button, and it says `Theme: dark`. Click Light, `Theme: light`.

- The settings page gets a script of its own, `settings.js`, that runs once the page is read. Under the theme buttons, a paragraph with the id `current-theme`.
- In `settings.js`, an object called `settings` has a method that writes `Theme: ` and a theme's name, in small letters, in `#current-theme`.
- When the page opens, the method writes `system`. A click on a theme button calls it with that button's theme: `light`, `dark` or `system`.

Psst, a method is called like `console.log`: the object, a dot, the method, and the brackets :)
