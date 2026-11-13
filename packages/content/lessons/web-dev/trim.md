You sign up for a game and type your nickname, but your thumb also hits the space bar a few times. Now the scoreboard shows `   Rocket   `, with gaps before and after it, or worse, a nickname of only spaces. The spaces at the ends of a text are almost never wanted.

## `trim()`

`trim()` gives back the text without the spaces at its start and at its end:

```js
const typed = "   Rocket   ";
console.log(`[${typed}]`);
console.log(`[${typed.trim()}]`);
```

```text
[   Rocket   ]
[Rocket]
```

The brackets are only there so you can see where each text starts and ends. The spaces inside the text stay: `"  Rocket Man  ".trim()` gives `"Rocket Man"`.

`trim()` doesn't change the text you call it on. It gives back a new text, so keep it in a variable when you need it again:

```js
const nickname = typed.trim();
```

## A text of only spaces

Remember: a text of only spaces is truthy, because it isn't empty. Trimmed, it becomes `""`, which is falsy:

```html preview
<label for="nickname">Nickname</label>
<input id="nickname" />
<p>Your badge: <span id="badge">No nickname yet</span></p>
<script>
  const nickname = document.querySelector("#nickname");
  const badge = document.querySelector("#badge");

  nickname.addEventListener("input", () => {
    const typed = nickname.value.trim();
    if (typed) {
      badge.textContent = typed;
    } else {
      badge.textContent = "No nickname yet";
    }
  });
</script>
```

Type three spaces in the box: the badge still says `No nickname yet`. Type `Rocket` after them: the badge says `Rocket`, with no gap in front.

The browser doesn't trim for you. A `required` box with only spaces in it counts as filled in, so the browser sends it. The script has to check it.

## Break it on purpose

Forget the brackets:

```js
const typed = nickname.value.trim;
```

Type `Rocket`. The badge shows:

```text
function trim() { [native code] }
```

Without `()`, `trim` is only the name of the function, and nothing calls it. A function is truthy, so the `if` lets it through, and the page writes the function itself. `trim()` needs its brackets.

---

## Mission: Only spaces

Your pass shows the name as it's typed. But a passenger who types only spaces gets an empty `Passenger:` line, and the browser books a seat for nobody: `required` and `minlength` count the spaces too.

**Example**: type three spaces in the name box. The pass says `Passenger: No name yet`. Fill in the rest of the form and click **Book my seat**: the page says

```text
Please write your name
```

Type `  Ida Moreau  `, with spaces around it, and send again: the pass says `Ida Moreau`, and the page says `Seat booked for Ida Moreau on SL-102`.

- Spaces at the start and the end of the name don't count, on the pass and in `#confirmation`.
- While the name is only spaces, `#pass-name` says `No name yet`, as for an empty box.
- A booking with a name of only spaces books no seat: `#confirmation` says `Please write your name`.

Psst, `trim()` needs its brackets :)
