Put your finger on a key of your phone's keyboard. You touch the key, but you also touch the keyboard, the screen, and the phone. A click on a page is the same: a click on a button is also a click on everything around the button.

## An event goes up through the parents

Here, a button sits in a paragraph, and the paragraph in a box. All three listen for a click, and each one writes its name:

```html preview
<div id="club">
  <p id="line">Chess club <button type="button" id="join">Join</button></p>
</div>
<p id="log"></p>
<script>
  const log = document.querySelector("#log");

  document.querySelector("#join").addEventListener("click", () => {
    log.textContent = log.textContent + "button ";
  });
  document.querySelector("#line").addEventListener("click", () => {
    log.textContent = log.textContent + "paragraph ";
  });
  document.querySelector("#club").addEventListener("click", () => {
    log.textContent = log.textContent + "box ";
  });
</script>
```

Click **Join**, and the page says:

```text
button paragraph box
```

One click, three listeners. The click starts on the element clicked, the button. Then it goes up to its parent, the paragraph, then to the parent's parent, the box, and on up to the page. Every listener on the way runs. A bubble goes up in water in the same way, so this is called **bubbling**.

Now click the words `Chess club`, next to the button. The page adds `paragraph box`: the click starts on the paragraph, so the button's listener doesn't run.

## The target stays the same

On the way up, the event object doesn't change. In every listener, `event.target` is still the element clicked first:

```js
document.querySelector("#club").addEventListener("click", (event) => {
  console.log(event.target.textContent);
});
```

Click **Join**, and the box's listener logs:

```text
Join
```

The listener is on the box, but `event.target` is the button.

## A click anywhere in it

Bubbling makes a whole element easy to click. A listener on a song's line hears clicks on everything inside it, the song's name and the band's name too:

```html preview
<ul>
  <li class="song"><strong>Yellow Submarine</strong> by The Beatles</li>
  <li class="song"><strong>Dancing Queen</strong> by ABBA</li>
</ul>
<p>Now playing: <span id="playing">nothing</span></p>
<script>
  const playing = document.querySelector("#playing");

  for (const song of document.querySelectorAll(".song")) {
    song.addEventListener("click", () => {
      playing.textContent = song.querySelector("strong").textContent;
    });
  }
</script>
```

Click `ABBA`, and the page says `Now playing: Dancing Queen`. The click starts on the line itself, or on the `<strong>` in it, and goes up to the line's listener either way. The listener finds the song's name in `song`, the line it was added to.

## Break it on purpose

Read the name from `event.target` instead:

```js
song.addEventListener("click", (event) => {
  playing.textContent = event.target.textContent;
});
```

Click `Dancing Queen`: it works. Click `by ABBA`: the page says `Now playing: Dancing Queen by ABBA`, the whole line. `event.target` is whatever was clicked inside the line, so it changes with where the click lands. To work with the element that has the listener, use your own variable, `song`.

---

## Mission: Next to read

Readers want to pick the page they will read next by clicking its card, without having to aim at a small heading.

**Example**: click anywhere on the airlock's card, and over the list the page says:

```text
Next to read: The Airlock
```

- Over the list, an element with the id `picked` holds the title of the card clicked last, and only the title: words like `Next to read:` go outside it.
- A click anywhere on a card picks it: on its heading, on its text, or on the card itself.
- The title comes from the card on the page, so a new card with another title works too.

Psst, `event.target` is what was clicked inside the card, not always the card :)
