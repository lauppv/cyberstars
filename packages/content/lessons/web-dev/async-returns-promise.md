When you send a friend to the shop, you don't stand next to them while they shop. You say: "Text me when you're back, and tell me what it cost." Your friend goes, you do other things, and the answer comes later. An `async` function is that friend.

## What an `async` function returns

An `async` function pauses at every `await`. But whoever called it doesn't pause: the script goes on at once. So what does the call give back, if the function isn't finished?

A **promise**. Every `async` function returns one, always, at once. When the function reaches its end, the promise holds what the function returned:

```js
async function shop() {
  await cookLater("done", 2000);
  return 12;
}

const trip = shop();
console.log(trip);
```

```text
Promise {…}
```

`trip` isn't 12: it's a promise of it. And you already know how to get a promise's value: `.then`.

```js
shop().then((price) => {
  console.log("The shopping cost " + price + " euros");
});
```

```text
The shopping cost 12 euros
```

The line comes two seconds later, when `shop` reached its `return`. Inside another `async` function, `const price = await shop();` does the same.

That's why you could `await cookLater(...)` and `await` a function like `shop()` the same way: both give a promise.

## Break it on purpose

Leave out the `return 12;`. The function still ends, and its promise still comes, but it holds `undefined`: "The shopping cost undefined euros". Then write `const price = shop();` and log `price` right away, without `.then` or `await`. You get the promise, not the price.

---

## Mission: Radar report

The radar should report how many scans it made once it's done, so the rest of the page knows the sky was checked.

**Example**: the line goes through its scans as before. When it says `Starships found`, the console shows:

```text
Radar done after 3 scans
```

- `scanRadar` returns the number of scans it made, `3`, once it wrote `Starships found`.
- When the page opens, the call to `scanRadar` gets that number with `.then` and logs `Radar done after 3 scans`, only once the radar is done.
- The line still goes through its three scans, half a second apart.

Psst, the number comes through the promise, so the line is logged inside `.then` :)
