Message boxes are fun once. But imagine one popping up every time something happens: you'd go mad clicking OK. When a script wants to tell **you**, the person writing it, what it's doing, it writes in a quiet place instead: the **console**.

## The console

The console is a list of messages from the page's scripts. Under your preview there's one: it shows every line your page writes there. Every real browser has one too, hidden in Inspect, under the **Console** tab.

## `console.log`

```js
console.log("Game club loaded");
console.log(12);
console.log("Members:", 12);
```

The console shows:

```text
Game club loaded
12
Members: 12
```

- Text goes in quotes. In JavaScript, a piece of text is called a **string**.
- A number goes **without** quotes: `12`.
- Several values with commas between them come out on one line, with a space between each.

Visitors never see the console. It's your window into what the script is doing, and you'll use it all the time to check your work.

## Strings and numbers

`"12"` and `12` look the same in the console, but they aren't the same thing: the first is text, the characters 1 and 2. The second is a number you can do maths with. You'll see why that matters soon.

## Break it on purpose

Write `console.Log` with a capital L:

```js
console.Log("Game club loaded");
```

Nothing is logged, and the console shows a red line instead: an **error**. JavaScript cares about capital letters: `log` and `Log` are different words. You'll learn to read those red lines in the next lesson.

---

## Mission: Report to the console

Your `crew.js` pops up a message box. The crew finds it annoying, so it should report to the console as well.

**Example**: when `crew.html` opens, the console under the preview shows:

```text
Crew directory loaded
4
```

- The console shows `Crew directory loaded`.
- On another line, it shows the number `4`, as a number.

Psst, a number has no quotes :)
