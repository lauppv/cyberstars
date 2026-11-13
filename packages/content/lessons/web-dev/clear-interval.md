At the start of a race, the starter counts down: 3, 2, 1, go! At "go", the counting stops. Nobody goes on with minus 1, minus 2. A countdown made with `setInterval` needs a way to stop too.

## A timer that never stops

`setInterval` goes on as long as the page is open:

```js
let left = 3;
setInterval(() => {
  console.log(left);
  left = left - 1;
}, 1000);
```

```text
3
2
1
0
-1
-2
```

And on and on, a line a second, for ever.

## `clearInterval`

`setInterval` gives back a number: the timer's id, like a ticket for it. Keep it in a variable, and give it to `clearInterval` to stop that timer:

```js
let left = 3;
const timer = setInterval(() => {
  if (left === 0) {
    console.log("Go!");
    clearInterval(timer);
  } else {
    console.log(left);
    left = left - 1;
  }
}, 1000);
```

```text
3
2
1
Go!
```

After "Go!", nothing more comes: the timer is gone. The function can stop its own timer, as here, or any other code can, as long as it has the id.

`setTimeout` gives an id too, and `clearTimeout` cancels it before it runs.

## Starting on a click

A countdown often starts from a button. Then `setInterval` goes inside the click's function:

```html preview
<button type="button" id="go">Start</button>
<p id="count"></p>
<script>
  document.querySelector("#go").addEventListener("click", () => {
    let left = 3;
    document.querySelector("#count").textContent = left;
    const timer = setInterval(() => {
      left = left - 1;
      if (left === 0) {
        document.querySelector("#count").textContent = "Go!";
        clearInterval(timer);
      } else {
        document.querySelector("#count").textContent = left;
      }
    }, 1000);
  });
</script>
```

Press Start: 3, 2, 1, Go!, and it stops there.

## Break it on purpose

Delete the line `clearInterval(timer);` in the example and press Start. You get 3, 2, 1, Go!, and a second later -1, then -2, -3... The function still runs every second, and nothing tells it to stop. A countdown always needs its `clearInterval`.

Then put the line back and press Start twice, quickly. Now two timers run at once, each with its own count, both writing on the same line. Here they happen to show the same numbers, a moment apart, but the page is doing everything twice. A button that starts a timer should wait until the timer is done: `disabled`, from the Boarding Form, stops it from being pressed again.

---

## Mission: The launch countdown

The countdown panel should count down to a launch, from a button.

**Example**: under the countdown sound, a button such as "Start the countdown". A click shows `10`, then `9` a second later, down to `1`, and then:

```text
Lift off!
```

- In the countdown's panel, a button with the id `start-countdown`, and a paragraph with the id `launch-countdown`, empty until the button is pressed.
- A click shows `10`, then a number one smaller every second, down to `1`. A second after `1`, it says `Lift off!`, and stays like that: the counting stops.
- While it counts, the button can't be pressed. After `Lift off!`, it can be pressed again, and a new countdown starts at 10.

Psst, keep the timer's id in a variable, so you can stop it :)
