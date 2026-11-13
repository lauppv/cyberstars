When you write a message on some phones, a small counter shows how many letters you have left: 160, 159, 158... It changes with every letter, and you never press a button for it. A page can react while the visitor types, too.

## The `input` event

The `input` event happens each time what is in a box changes: a letter typed, a letter deleted, a word pasted.

```html preview
<label for="nickname">Nickname</label>
<input id="nickname" />
<p>Your badge: <span id="badge"></span></p>
<script>
  const nickname = document.querySelector("#nickname");
  const badge = document.querySelector("#badge");

  nickname.addEventListener("input", () => {
    badge.textContent = nickname.value.toUpperCase();
  });
</script>
```

Type `rocket` slowly. The badge follows you, letter by letter: `R`, `RO`, `ROC`... until it says `ROCKET`. Delete a letter, and the badge loses it too. There is no button: each change is an event.

## Counting what's left

The same event can count. `length` gives the number of characters in a text, spaces too:

```html preview
<label for="message">Message to the team (50 characters at most)</label>
<textarea id="message" rows="3" maxlength="50"></textarea>
<p id="left">50 letters left</p>
<script>
  const message = document.querySelector("#message");
  const left = document.querySelector("#left");

  message.addEventListener("input", () => {
    left.textContent = `${50 - message.value.length} letters left`;
  });
</script>
```

Type `See you at six`. The line under the box says:

```text
36 letters left
```

`See you at six` has 14 characters, with its three spaces, and 50 - 14 is 36.

## Break it on purpose

Listen for `"change"` instead of `"input"`:

```js
message.addEventListener("change", () => {
  left.textContent = `${50 - message.value.length} letters left`;
});
```

Type in the box: the counter doesn't change. Click outside the box: now it changes, all at once. For a box you type in, `change` only happens when you leave it. You'll use `change` in the next lesson, where it fits better.

---

## Mission: A live pass

Your pass shows the name only after a click on **Show my pass**. The notes box takes up to 200 characters, but the passenger can't see how many are left.

**Example**: type `Ida` in the name box, and the pass already says `Passenger: Ida`. Keep typing, and it follows you up to `Ida Moreau`. Under the notes box, a line says:

```text
200 characters left
```

Type `Vegan meal` in the notes, and it says `190 characters left`.

- `#pass-name` follows the name box as the passenger types, with no click. You can remove the button **Show my pass**: it has no job any more.
- Under the notes box, an element with the id `notes-left` says `200 characters left` when the page opens.
- Each change in the notes box changes it, like `190 characters left` after `Vegan meal`.

Psst, spaces are characters too :)
