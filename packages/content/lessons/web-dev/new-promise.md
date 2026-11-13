At a busy burger place, you pay and get a small ticket with a number on it. It isn't your burger. It's a promise: "your burger is coming, and this number is how you'll get it." You can sit down, talk, look at your phone. When your number is called, you get the real thing.

## A value that comes later

In the last lesson, the answer came inside a `setTimeout`, and only that function could use it. Code that wants the answer somewhere else has no way to get it.

A **promise** is JavaScript's ticket. It's an object you get **at once**, which stands for a value that will come **later**. You can keep it in a variable, return it from a function and pass it around, long before the value is there.

## `new Promise` and `resolve`

You make a promise with `new Promise`, and give it a function. JavaScript calls that function at once, and hands it `resolve`: the way to say "the value is here".

```js
const order = new Promise((resolve) => {
  setTimeout(() => {
    resolve("a burger");
  }, 3000);
});

console.log("I have my ticket");
```

```text
I have my ticket
```

The line shows at once: making a promise doesn't wait. Three seconds later, `resolve("a burger")` runs, and the promise now **holds** "a burger". Nothing shows for that yet. In the next lesson you'll read what a promise holds.

## A function that returns a promise

Most of the time, a function makes the promise and returns it. Whoever calls the function gets the ticket:

```js
function cookLater(dish, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dish);
    }, ms);
  });
}

const myOrder = cookLater("pancakes", 2000);
```

`myOrder` is a promise right away. In two seconds, it holds "pancakes". Call `cookLater("soup", 500)`, and that ticket holds "soup" half a second later.

## Break it on purpose

Leave out `return` in `cookLater`. The promise is still made, but the function gives nothing back: `myOrder` is `undefined`, and nobody has the ticket. Then call `resolve()` with nothing in the brackets. The promise keeps its word, but holds `undefined` instead of the dish.

---

## Mission: An answer, later

Soon the tracker will get its starships from far away. Until then, a function of your own will play the slow tracker, and give a promise of its answer.

**Example**: `answerLater("Aurora", 500)` gives a promise at once. Half a second later, the promise holds `"Aurora"`. The tests call your function themselves and write in the console what they find, like `test: it holds Aurora`.

- In `tracker.js`, a function `answerLater(value, ms)` returns a new promise, at once.
- After `ms` milliseconds, and not sooner, the promise holds `value`.
- The lines from the last lesson still show in the console.

Psst, a function gives its promise back only with `return` :)
