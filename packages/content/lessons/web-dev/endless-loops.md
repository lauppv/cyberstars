Have you ever been stuck on a song that plays again and again in your head? A loop can get stuck too: if its "keep going" is always true, it never stops. That's an **endless loop**, and it's one of the most common bugs in programming.

## How it happens

```js
for (let i = 3; i >= 1; i++) {
  console.log(i);
}
```

Read it carefully. `i` starts at 3. The loop keeps going while `i >= 1`. And after each lap... `i++` makes it **bigger**: 4, 5, 6... It never gets below 1, so the loop never stops. It wanted `i--`.

## What you see

A browser running an endless loop freezes: the page stops answering, buttons don't work, and after a while the browser asks if you want to stop the page.

Your preview protects you: when a loop runs for more than 2 seconds, it stops it, says in the console which line it was on, and pauses the preview. Fix the loop, then press **Show the page again**.

## Finding the problem

When a loop never ends, check its three parts against each other:

1. where does the counter **start**?
2. when does it **stop**?
3. does each lap bring it **closer** to stopping?

The third one is the usual culprit: a `++` that should be `--`, or a counter that never changes at all.

## Break it on purpose

Leave out the change altogether:

```js
for (let i = 3; i >= 1; ) {
  console.log(i);
}
```

`i` stays 3 forever. Your preview stops it after 2 seconds. Look at the console, then fix it.

---

## Mission: The engine cool-down

Your site has a new file, `countdown.js`: the engines' cool-down. It should count 3, 2, 1, then switch the engines off. But it never finishes.

**Example**: once it's fixed, the console shows, among its other lines:

```text
Cooling: 3
Cooling: 2
Cooling: 1
Engines off
```

- `crew.html` loads `countdown.js` from its `<head>`, with `defer`.
- The console shows `Cooling: 3`, `Cooling: 2`, `Cooling: 1` and `Engines off`.
- The page doesn't get stuck, and the console shows no errors.

Psst, does each lap bring the counter closer to stopping? :)
