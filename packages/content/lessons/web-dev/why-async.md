You order a pizza on the phone. Do you stand still next to the door for 30 minutes, doing nothing, until it comes? No. You lay the table, play a game, and when the bell rings, you open the door. A web page does the same when it asks for something from far away.

## Asking takes time

Until now, everything a script needed was already in the page. The tracker is different: its starships are on another computer, far away. The page has to ask for them over the internet, and the answer comes back later: in a tenth of a second on a good day, in a few seconds on a slow phone.

What should the page do meanwhile?

## A page that waited would freeze

If the script stopped and waited for the answer, the whole page would wait with it. No click would work, no menu would open, no spinner would turn. For a few seconds, the page would look dead.

So JavaScript never waits like that. It **asks**, then goes on at once with the next line. When the answer arrives, a function you gave it runs. Code that works like this is called **asynchronous**, or **async**: it doesn't happen in the order the lines are written.

You've seen it already, with `setTimeout`:

```js
console.log("Ordering a pizza");

setTimeout(() => {
  console.log("The pizza is here!");
}, 2000);

console.log("Laying the table");
```

```text
Ordering a pizza
Laying the table
The pizza is here!
```

"Laying the table" comes before the pizza, even though its line is the last one. `setTimeout` starts the timer and the script goes on. Two seconds later, the function runs.

Asking a computer far away works the same way. In the next lessons you'll ask for real starships. For now, `setTimeout` plays the part of the slow answer.

## Break it on purpose

Put the last `console.log` inside the function, after "The pizza is here!". Now the table is laid only after the pizza came: everything waits for the slow part. On a page, that would be the frozen page from above. Then write `setTimeout(..., 2)` with the 2 meaning seconds. The pizza comes at once: the time is in milliseconds.

---

## Mission: Asking the tracker

The tracker will soon ask for real starships. First, see how the page goes on while it waits.

**Example**: open the tracker, and the console shows the first two lines at once, the third one a second later:

```text
Asking for the starships
Waiting for the answer
The starships answered
```

- The tracker gets a script of its own, `tracker.js`, that runs once the page is read. No other page loads it.
- When the page opens, it logs `Asking for the starships`. One second later, a timer logs `The starships answered`.
- Right after setting the timer, without waiting for it, the page logs `Waiting for the answer`.

Psst, `setTimeout` takes milliseconds: a second is 1000 :)
