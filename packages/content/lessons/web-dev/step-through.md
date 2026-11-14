Following a cooking video one step at a time, you pause after each step to catch up, and when the cook says "make the sauce, I showed it in another video", you open that video and follow it too. The debugger lets you follow code the same way: a line at a time, and into the functions it calls.

## Stepping

Once the code stopped on a breakpoint, you don't have to jump to the next breakpoint. The buttons next to Resume move one step at a time:

- **Step over** (F10): run this line, and stop on the next one. If the line calls a function, the whole function runs, and you don't watch it.
- **Step into** (F11): if the line calls a function, go inside it, and stop on its first line. Now you watch the function work.
- **Step out** (Shift+F11): run the rest of this function, and stop where it was called from.

Watch the Scope part as you step: every value changes as the lines run.

## Where the bug hides

A function that gives a wrong answer often isn't wrong itself. It calls another function, which gives it a wrong value. So you stop where the wrong answer is made, step into the function it calls, and watch that one, line by line.

```js
function sum(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total;
}

function average(numbers) {
  return sum(numbers) / numbers.length;
}
```

Stop on the `return` of `average`, step into `sum`, and step over each line of its loop: you see `total` grow with each number, and where it stops.

## Break it on purpose

Use Step over on the line that calls the function you want to see. It runs whole, and you're on the next line already, holding its wrong result. Step into it instead. Then press Step into on a line like `console.log(...)`: you land in code that isn't yours. Step out to get back.

---

## Mission: The average crew

The lesson brings a file, `average-crew.js`, whose function gives the average crew of the starships. It has a bug, and not where you'd look first.

**Example**: under the total, a line:

```text
Average crew: 4.8
```

24 people on 5 starships make 4.8 each, on average. Before the fix, the line says much less.

- Between `#crew-total` and the list `ships`, a paragraph with the id `average-crew`. Once the starships are in, it says `Average crew: ` and what the function of `average-crew.js` gives for them, rounded to one decimal.
- `average-crew.js` gives the right average for any starships. Step into its functions to find the bug, and fix it in that file.

Psst, round with `Math.round` on the average times 10, then divide by 10 :)
