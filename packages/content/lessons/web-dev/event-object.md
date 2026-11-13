In a quiz on TV, every player has a buzzer. When a buzzer sounds, the host must know whose buzzer it was. The sound alone isn't enough. In a script, one function can listen to many buttons, and it needs to know the same thing: which one was clicked?

## The event object

When an event happens, the browser writes down facts about it in an object, the **event object**, and gives it to your function. To get it, give the function a parameter. Most people call it `event`:

```js
button.addEventListener("click", (event) => {
  console.log(event.type);
});
```

Click the button, and the console says:

```text
click
```

`event.type` is the name of the event that happened. The object holds more facts than that, and one of them answers our question.

## `event.target`: the element it happened on

`event.target` is the element the event happened on: the button clicked. Here, one function listens to two buttons:

```html preview
<p>Who scored?</p>
<button type="button" id="lions">Lions</button>
<button type="button" id="tigers">Tigers</button>
<p id="last-goal"></p>
<script>
  const lastGoal = document.querySelector("#last-goal");

  function goal(event) {
    lastGoal.textContent = `Goal for the ${event.target.textContent}!`;
  }

  document.querySelector("#lions").addEventListener("click", goal);
  document.querySelector("#tigers").addEventListener("click", goal);
</script>
```

Click **Tigers**, and the page says:

```text
Goal for the Tigers!
```

Click **Lions**, and it says `Goal for the Lions!`. The function is written once. On each click, `event.target` is the button clicked.

Look at `addEventListener("click", goal)`: we give it the function's name, with no brackets, as you gave `isHigh` to `filter`. The browser calls `goal` on each click, and gives it the event object.

## A box as the target

With round buttons and boxes to tick, the target is the box clicked, so `event.target.value` is its `value`:

```html preview
<p>Your size?</p>
<input type="radio" id="small" name="size" value="S" />
<label for="small">Small</label>
<input type="radio" id="medium" name="size" value="M" />
<label for="medium">Medium</label>
<input type="radio" id="large" name="size" value="L" />
<label for="large">Large</label>
<p id="size-picked"></p>
<script>
  const sizePicked = document.querySelector("#size-picked");

  function showSize(event) {
    sizePicked.textContent = `Size: ${event.target.value}`;
  }

  for (const size of document.querySelectorAll('[name="size"]')) {
    size.addEventListener("click", showSize);
  }
</script>
```

Click **Medium**, and the page says `Size: M`. A click on a label counts as a click on its round button, so the target is still the round button.

## Break it on purpose

Add brackets after the function's name:

```js
document.querySelector("#lions").addEventListener("click", goal());
```

The console shows, as soon as the page opens:

```text
TypeError: Cannot read properties of undefined (reading 'target')
```

With brackets, `goal()` runs at once, when the page opens. Nobody has clicked, so there is no event object, and `event` is `undefined`. Give `addEventListener` the function's name, and let the browser call it.

---

## Mission: Which seat?

Your pass shows the passenger's name. Now it should show the seat too. Write one function for both seats, which finds the seat clicked with the event object.

**Example**: pick **On the aisle**, and the pass says:

```text
Seat: aisle
```

Pick **By the window**, and it says `Seat: window`.

- On the pass, an element with the id `pass-seat` shows the `value` of the seat picked: `window` or `aisle`, and only that.
- It changes each time another seat is picked.
- The button **Show my pass** still shows the name.

Psst, give `addEventListener` the function's name, without brackets :)
