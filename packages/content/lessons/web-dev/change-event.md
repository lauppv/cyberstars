In an online shop, you pick a size from a list, and the price under it changes at once. You tick "gift wrap", and a line says "Gift wrap: yes". You didn't type anything: you made a choice, and the page answered.

## The `change` event

The `change` event happens when the visitor makes a choice: a new option in a list, a box ticked or unticked, a round button picked. (In a box you type in, it waits until the visitor leaves the box, as you saw in the last lesson.)

```html preview
<label for="size">Pizza size</label>
<select id="size">
  <option value="">Pick a size</option>
  <option value="S">Small</option>
  <option value="M">Medium</option>
  <option value="L">Large</option>
</select>
<p>Size picked: <span id="size-picked"></span></p>
<script>
  const size = document.querySelector("#size");
  const sizePicked = document.querySelector("#size-picked");

  size.addEventListener("change", () => {
    sizePicked.textContent = size.value;
  });
</script>
```

Pick **Medium**, and the page says `Size picked: M`. A list's `value` is the `value` of the option picked, not the words it shows.

## `.checked`: ticked or not

A box to tick has a `value` too, but it never changes: it's what the form sends when the box is ticked. To know if the box is ticked now, read `.checked`. It's `true` while the box is ticked, and `false` while it isn't:

```html preview
<input type="checkbox" id="cheese" />
<label for="cheese">Extra cheese</label>
<p>Extra cheese: <span id="cheese-answer">no</span></p>
<script>
  const cheese = document.querySelector("#cheese");
  const cheeseAnswer = document.querySelector("#cheese-answer");

  cheese.addEventListener("change", () => {
    cheeseAnswer.textContent = cheese.checked ? "yes" : "no";
  });
</script>
```

Tick the box: the page says `Extra cheese: yes`. Untick it: `Extra cheese: no`.

Careful: `getAttribute("checked")` reads the HTML, which stays as you wrote it. Ticking a box changes `.checked`, not the HTML.

## Break it on purpose

Listen for `"click"` on the list:

```js
size.addEventListener("click", () => {
  sizePicked.textContent = size.value;
});
```

With the mouse, it may seem to work. Now press Tab until the list has the focus, and pick another size with the arrow keys. The page doesn't change: nobody clicked. The visitor made a choice, so listen for the choice: `change`.

---

## Mission: Flight and meal

Your pass has the passenger's name and seat. A passenger also wants to check the flight and the meal on it.

**Example**: pick the flight to Mars Relay, and the pass says `Flight: SL-102`. When the page opens, it says `Hot meal: no`. Tick the hot meal, and it says `Hot meal: yes`. Untick it, and it says `Hot meal: no` again.

- On the pass, an element with the id `pass-flight` shows the code of the flight picked, like `SL-102`, as soon as it's picked.
- An element with the id `pass-meal` says `yes` while the hot meal is ticked, and `no` while it isn't, from the start.
- The name, the seat and the counter still work.

Psst, `.checked` is already `true` or `false`: no quotes around it :)
