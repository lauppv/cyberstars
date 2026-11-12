In many games, you can leave the name box empty, and the game calls you "Player 1". Your name if you gave one, or "Player 1" if you didn't. A **default value**, the one to use when nothing was given, is so common that JavaScript has a short way to write it.

## `||` gives back a value

You know `||` as "or" between two questions. It does more than answer `true` or `false`: it gives back one of its two sides. If the left side is truthy, it gives back the left side. If not, it gives back the right side:

```js
const nickname = "";
const shown = nickname || "Player 1";
console.log(shown);
```

```text
Player 1
```

`nickname` is an empty text, which is falsy, so `||` gives back the right side. Change the first line to `const nickname = "Rocket";`:

```text
Rocket
```

`"Rocket"` is truthy, so `||` stops there and gives it back.

## One line instead of five

Last lesson, the badge needed an `if` and an `else`. With `||`, one line does it:

```html preview
<label for="nickname">Nickname</label>
<input id="nickname" />
<p>Your badge: <span id="badge">Player 1</span></p>
<script>
  const nickname = document.querySelector("#nickname");
  const badge = document.querySelector("#badge");

  nickname.addEventListener("input", () => {
    badge.textContent = nickname.value || "Player 1";
  });
</script>
```

Type `Rocket`: the badge says `Rocket`. Delete it all: `Player 1`.

Careful with numbers: `0` is falsy too. `score || 10` gives `10` when the score is `0`, even if `0` was the real score.

## Break it on purpose

Swap the two sides:

```js
badge.textContent = "Player 1" || nickname.value;
```

Type `Rocket`: the badge still says `Player 1`. `"Player 1"` is truthy, so `||` gives it back at once and never looks at the right side. The value you want first goes first, and the default value goes last.

---

## Mission: Any notes?

The pass shows the name, the flight, the seat and the meal, but not the notes for the crew.

**Example**: when the page opens, the pass says `Notes: No notes`. Type `Vegan meal` in the notes box, and it says `Notes: Vegan meal`. Press Escape in the notes box, and `No notes` comes back.

- On the pass, an element with the id `pass-notes` shows the notes as they are typed.
- With no notes, it says `No notes`: when the page opens, after the notes are deleted, and after Escape.
- The counter under the notes box still works.

Psst, the value you want first goes first :)
