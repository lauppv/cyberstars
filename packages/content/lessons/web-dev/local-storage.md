A game that forgets your level every time you close it would be no fun. Good games save: close them, come back tomorrow, and you're where you stopped. A web page forgets everything when it reloads, unless it saves what matters in the browser.

## Everything starts again

Variables live only while the page is open. Reload it, and the script runs again from the first line: every variable starts with its first value. The theme a visitor chose a minute ago is gone.

## `localStorage`

`localStorage` is a small store that the browser keeps for each website, even after the page is closed or the computer turned off. It holds texts, each under a name, called a **key**:

```js
localStorage.setItem("level", "7");
```

`setItem` saves the text `"7"` under the key `"level"`. If something was saved under that key before, it's replaced.

`getItem` reads it back, on this page or after any reload:

```js
const level = localStorage.getItem("level");
console.log(level);
```

```text
7
```

## Nothing saved yet

On a first visit, nothing has been saved, and `getItem` gives `null`:

```js
console.log(localStorage.getItem("nickname"));
```

```text
null
```

So a page reads what was saved, and keeps its usual start when it gets `null`:

```html preview
<button type="button" id="up">Next level</button>
<p id="shown"></p>
<script>
  let level = 1;
  const saved = localStorage.getItem("level");
  if (saved !== null) {
    level = Number(saved);
  }
  document.querySelector("#shown").textContent = `Level ${level}`;

  document.querySelector("#up").addEventListener("click", () => {
    level = level + 1;
    localStorage.setItem("level", level);
    document.querySelector("#shown").textContent = `Level ${level}`;
  });
</script>
```

Click a few times, then change the code a little so the preview starts again: the level is still there. `localStorage` keeps texts only: the number becomes a text when it's saved, and `Number` turns it back.

## Only in this browser

What a page saves stays in that browser, on that device. Open the site on your phone, and it knows nothing about your computer's choices. And everyone can see and delete what's in their own browser's store, so never keep a password or anything secret there.

## Break it on purpose

Read the saved value without checking for `null`: `level = Number(localStorage.getItem("level"))`. On a first visit, `Number(null)` is 0: the game starts at level 0. With a text it's worse: a theme of `null` would show "Theme: null". Always decide what a first visit gets.

---

## Mission: Remember the theme

Visitors choose a theme, reload the page, and their choice is gone. The settings page should remember it.

**Example**: click Dark, then reload the page: it still says `Theme: Dark`, with the Dark button pressed.

- Each time a theme is chosen, by its button or by bringing settings, it's saved in the browser under the key `theme`.
- When the page opens, a saved theme wins over the button pressed in the HTML. Without a saved theme, the page starts as before.

Psst, on a first visit `getItem` gives `null` :)
