When you say "my bag", the word "my" means you. When your friend says "my bag", the same word means your friend. "My" points at whoever is speaking. Inside a method, JavaScript has a word like that: `this`.

## A method that uses its own object

A method often needs the object's other properties:

```js
const player = {
  name: "Mia",
  score: 0,
  win() {
    this.score = this.score + 1;
    console.log(`${this.name} has ${this.score} points`);
  },
};

player.win();
player.win();
```

```text
Mia has 1 points
Mia has 2 points
```

Inside `win`, `this` is `player`: the object the method was called on. `this.score` is the player's score, and the method changes it, so the second call goes on from 1.

## Why not the object's name?

`player.score` would work here too. But `this` is about the call: `player.win()` means "`win`, with `this` being `player`". Two objects can share the same code, and each call works on its own object:

```js
const win = function () {
  this.score = this.score + 1;
};
const mia = { name: "Mia", score: 0, win };
const leo = { name: "Leo", score: 5, win };

mia.win();
leo.win();
console.log(mia.score, leo.score);
```

```text
1 6
```

One function, two objects, and each call changed its own score. With `this`, a method also keeps working when you rename the variable that holds the object.

## Methods calling methods

`this` lets one method call another method of the same object: `this.show()` inside `choose` calls the object's own `show`.

## Break it on purpose

Write the method as an arrow function: `win: () => { this.score = this.score + 1; }`. Call `player.win()`, and the console shows ` has NaN points`: no name, and no number. The player's score didn't change at all. An arrow function has no `this` of its own: it uses the `this` of the code around it, which isn't the player. For a method that uses `this`, write it the short way, `win() { ... }`.

---

## Mission: The chosen theme stays chosen

The page says which theme was clicked, but the System button stays pressed whatever you click. The settings object should remember the theme, and press the right button.

**Example**: click Dark: the page says `Theme: dark`, the Dark button is now the yellow, pressed one, and System isn't pressed any more.

- The `settings` object holds the chosen theme in a property, `system` when the page opens.
- A method of it chooses a theme: it keeps it in that property, then calls the method that shows it, using `this` for both.
- Showing it writes `Theme: ` and the theme in `#current-theme`, and makes only the chosen theme's button say it's pressed: the other two say they aren't. A click on a theme button chooses its theme.

Psst, a method that uses `this` is written `name() { }`, not as an arrow function :)
