Sometimes, at the burger place, someone comes to your table and says: "Sorry, we're out of burgers." The ticket didn't bring you a burger, but it didn't leave you waiting forever either. It brought you bad news, and now you can choose something else.

## A promise can fail

Asking a computer far away doesn't always work: the internet is down, the other computer is broken, the address is wrong. A promise can say so. Next to `resolve`, the function inside `new Promise` gets a second one, `reject`: "it didn't work, and here is why".

```js
function cookLater(dish, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dish === "burger") {
        reject("We're out of burgers");
      } else {
        resolve(dish);
      }
    }, ms);
  });
}
```

A promise ends one way only: it is **resolved** with a value, or **rejected** with a reason. Once it ended, it stays that way.

## `.catch`

`.then` runs only when the promise is resolved. For a rejected one, `.catch` takes a function, which gets the reason:

```js
cookLater("burger", 1000)
  .then((dish) => {
    console.log("Eating " + dish);
  })
  .catch((problem) => {
    console.log("No luck: " + problem);
  });
```

```text
No luck: We're out of burgers
```

The `.then` function never runs. Ask for `"pancakes"` instead, and you get `Eating pancakes`, and the `.catch` function never runs. The two are written one after the other, so the code reads like a sentence: do this, or else that.

## Break it on purpose

Write the function with one parameter only: `new Promise((reject) => ...)`. The name doesn't matter, the order does: the first parameter is always the one that resolves. So `reject("We're out")` now **resolves** the promise, and `.then` eats a burger called "We're out". Then leave out `.catch` and reject: the reason shows in the console as an error. A failure nobody catches is an error on the page.

---

## Mission: A tracker that fails

Your slow tracker always answers. A real one sometimes doesn't, and the tracker page will need to handle that. Write the failing twin of `answerLater`.

**Example**: `failLater("No answer from the tracker", 800)` gives a promise at once. 800 milliseconds later, it is rejected with `"No answer from the tracker"`, so a `.catch` gets that text and a `.then` never runs. The tests try it themselves, and write in the console what they find, like `test: caught No answer from the tracker`.

- In `tracker.js`, a function `failLater(message, ms)` returns a new promise, at once.
- After `ms` milliseconds, and not sooner, the promise is rejected with `message`.
- The tracker's line still says `Starships found` a second after it opens.

Psst, `reject` is the second parameter, even when you don't need the first :)
