At school, the whiteboard is cleaned after each lesson. What the teacher wrote is gone, and the next lesson starts with an empty board. The notice board in the hall is different: its papers stay there all year. In JavaScript, a variable is like one or the other. It depends on where you make it.

## A variable lives in its block

A pair of braces, `{` and `}`, makes a **block**: the steps of an `if`, of a loop, of a function. A variable made with `let` or `const` inside a block lives only in that block. That place is the variable's **scope**.

```js
const points = 7;

if (points > 5) {
  const message = "Well played!";
  console.log(message);
}

console.log(message);
```

```text
Well played!
ReferenceError: message is not defined
```

Inside the block, `message` works. After the `}`, it doesn't exist anymore, so the last line stops with an error.

## Inside sees outside

It works the other way round. A block sees the variables made around it:

```js
const team = "Lions";
const goals = 3;

if (goals > 2) {
  console.log(`What a game, ${team}!`);
}
```

```text
What a game, Lions!
```

Inside sees outside. Outside doesn't see inside.

## A listener's block starts again on each click

The steps of a listener are a block too. On each click, they run again from the first line. So a variable made inside starts again each time, like the whiteboard. A value that must last from one click to the next goes outside, like the notice board:

```html preview
<button type="button" id="goal">Goal!</button>
<p id="goals">Goals: 0</p>
<script>
  const goalsLine = document.querySelector("#goals");
  let goals = 0;

  document.querySelector("#goal").addEventListener("click", () => {
    goals = goals + 1;
    goalsLine.textContent = `Goals: ${goals}`;
  });
</script>
```

Click **Goal!** three times. The page says `Goals: 1`, then `Goals: 2`, then `Goals: 3`. `goals` is made once, when the page opens, and every click adds to the same variable. It's the `let total = 0` before the loop, which you know from adding up.

## Break it on purpose

Move `let goals = 0;` into the listener:

```js
document.querySelector("#goal").addEventListener("click", () => {
  let goals = 0;
  goals = goals + 1;
  goalsLine.textContent = `Goals: ${goals}`;
});
```

Click three times: the page says `Goals: 1`, and again `Goals: 1`. No error. Each click makes a new `goals` at 0 and adds one, and the variable is gone at the `}`. If a count never gets past 1, look at where its variable is made.

---

## Mission: Count the thanks

The thank button says thank you, but nobody knows how many thanks the writers got.

**Example**: under the message, the page says `Thanks: 0`. Click **Thank the writers** three times, and it says:

```text
Thanks: 3
```

- An element with the id `thanks-count` says `Thanks: 0` when the page opens.
- Each click on `#thank` adds one: `Thanks: 1`, `Thanks: 2`, and so on, for as many clicks as come.
- The message still says thank you after each click.

Psst, a variable made inside the listener starts again on every click :)
