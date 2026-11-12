In a video game, you press Escape and the menu opens. In a chat app, you press Enter and your message goes. Some keys do more than type a letter. A page can listen for them, too.

## `keydown` and `event.key`

Each key pressed in a box is a `keydown` event on that box. The event object says which key it was, in `event.key`:

```js
const search = document.querySelector("#search");

search.addEventListener("keydown", (event) => {
  console.log(event.key);
});
```

Click in the box and type `Hi!`. The console says:

```text
Shift
H
i
Shift
!
```

A letter gives the letter. Other keys give their name, which starts with a capital letter: `Enter`, `Escape`, `Backspace`, `ArrowUp`, `Shift`.

## One key, one job

An `if` picks the key you want. Here, Escape empties the search box:

```html preview
<label for="search">Search the games</label>
<input id="search" />
<script>
  const search = document.querySelector("#search");

  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      search.value = "";
    }
  });
</script>
```

Type `chess`, then press Escape: the box is empty. A script can write `.value` too, like `textContent`, and the box shows the new value at once.

## A box emptied by the script

The `input` event comes from the visitor's changes. When your script writes `.value`, no `input` event happens. So a counter that listens for `input` doesn't see a box emptied by the script. Put the counting in a function, and call it in both places:

```html preview
<label for="search">Search the games</label>
<input id="search" />
<p id="count">0 letters</p>
<script>
  const search = document.querySelector("#search");
  const count = document.querySelector("#count");

  function updateCount() {
    count.textContent = `${search.value.length} letters`;
  }

  search.addEventListener("input", updateCount);

  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      search.value = "";
      updateCount();
    }
  });
</script>
```

Type `chess`: `5 letters`. Press Escape: the box is empty, and the line says `0 letters`.

## Break it on purpose

Write the key's name a little differently:

```js
if (event.key === "Esc") {
```

Press Escape: nothing happens, and the console shows no error. The key is called `"Escape"`, and `"Esc"` is just another text that never comes. Key names are exact, capital letter too.

---

## Mission: Escape the notes

A passenger who wrote a long note and changed their mind has to delete it letter by letter.

**Example**: type `Vegan meal` in the notes box, then press Escape. The box is empty, and the line under it says `200 characters left` again.

- Escape in the notes box empties it.
- The counter under it then says `200 characters left`.
- Escape in any other box leaves the notes as they are, and other keys in the notes box type as usual.

Psst, a box emptied by your script sends no `input` event :)
