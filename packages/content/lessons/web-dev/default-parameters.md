At a café, you ask for a hot chocolate and don't say the size. You get a medium. Medium is the **default**: what you get when you don't choose. A function's parameter can have a default too.

## A parameter's default value

Write `=` and a value after the parameter's name:

```js
const order = (drink, size = "medium") => `One ${size} ${drink}, please`;

console.log(order("tea", "large"));
console.log(order("tea"));
```

```text
One large tea, please
One medium tea, please
```

The first call gives a size, so `size` is `"large"`. The second call gives nothing for `size`, so it gets its default, `"medium"`.

A parameter that gets nothing is `undefined`. The default takes the place of that `undefined`. Without `= "medium"`, the second line would say `One undefined tea, please`.

## Only when nothing comes

Now give an empty text as the size:

```js
console.log(order("tea", ""));
```

```text
One  tea, please
```

The default doesn't come: an empty text is still a value. A default replaces only a value that is missing. That's not like `||`, which replaces every falsy value, the empty text too.

## A message with a default

Here a function writes every message of a game page. When the page opens, it's called with nothing, so it writes its default:

```html preview
<p id="game-status"></p>
<button type="button" id="save">Save the game</button>
<script>
  const gameStatus = document.querySelector("#game-status");

  const showStatus = (text = "Nothing saved yet") => {
    gameStatus.textContent = text;
  };

  showStatus();

  document.querySelector("#save").addEventListener("click", () => {
    showStatus("Game saved");
  });
</script>
```

The page opens with `Nothing saved yet`. Click **Save the game**, and it says `Game saved`.

## Break it on purpose

Give `showStatus` straight to `addEventListener`:

```js
document.querySelector("#save").addEventListener("click", showStatus);
```

Click the button, and the page says:

```text
[object PointerEvent]
```

The browser calls the function on each click, and gives it the event object. So `text` isn't missing: it is the event object, and the default never comes. To call a function with your own text, or with nothing, call it inside `() => { ... }`.

---

## Mission: A word for the reader

The front page of your wiki counts its articles. Now it greets the reader, and lets them thank the people who wrote it.

**Example**: under the wiki's last line, a button says `Thank the writers`, and under it the page says:

```text
Happy reading!
```

Click the button, and it says:

```text
Thank you! The writers will be glad.
```

- After the wiki's last line, a button with the id `thank`, and an element with the id `wiki-message`.
- One function writes every message in `#wiki-message`. Given no text, it writes `Happy reading!`, and that's what the page says when it opens.
- A click on `#thank` makes the same function write `Thank you! The writers will be glad.`

Psst, a default comes only when nothing is given :)
