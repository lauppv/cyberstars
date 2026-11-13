On a help page, each question has a small arrow next to it. Click the question, and the answer opens under it, and the arrow turns down. Click again, and the answer closes. One look at the arrow tells you whether the answer is open. A screen reader can't see the arrow, so the page has to tell it in words.

## `aria-expanded`

`aria-expanded` goes on the button that opens and closes something. It says `"true"` while that thing shows, and `"false"` while it's hidden. A screen reader then says "Club rules, button, expanded" or "Club rules, button, collapsed".

```html preview
<style>
  .closed {
    display: none;
  }
</style>
<button type="button" id="rules-button" aria-expanded="false">Club rules</button>
<ul id="rules" class="closed">
  <li>Be on time.</li>
  <li>Shake hands after each game.</li>
</ul>
<script>
  const rulesButton = document.querySelector("#rules-button");
  const rules = document.querySelector("#rules");

  rulesButton.addEventListener("click", () => {
    const closed = rules.classList.toggle("closed");
    rulesButton.setAttribute("aria-expanded", !closed);
  });
</script>
```

Click **Club rules**: the rules open, and the button now has `aria-expanded="true"`. Click again: they close, and it says `"false"`. The page looks the same as without the attribute; the change is for the ear.

`toggle` gives back `true` when it has just added `closed`, so the rules are now hidden. `!closed` is the opposite: `false` when they're hidden, `true` when they show. That is exactly what `aria-expanded` must say.

## Expanded or pressed?

You've met `aria-pressed` on the flight schedule. The two are for different buttons:

- `aria-pressed` is for a switch that stays on or off, like mute or Hide cancelled. A screen reader says "pressed" or "not pressed".
- `aria-expanded` is for a button that opens something you can then see, like an answer, a list or a menu. A screen reader says "expanded" or "collapsed".

A button gets one of them, never both.

## Break it on purpose

Write `aria-expanded="false"` in the HTML, and never change it in the script:

```js
rulesButton.addEventListener("click", () => {
  rules.classList.toggle("closed");
});
```

The rules still open and close, and no error shows anywhere. But the screen reader says "collapsed" all the time, even while the rules are open. A visitor who can't see the screen is told the wrong thing. Each time the script opens or closes something, it also sets `aria-expanded`.

---

## Mission: Open or closed?

Your Menu button hides and shows the menu. But a screen reader only says "Menu, button": it can't tell whether the menu is showing.

**Example**: open any page. A screen reader on the button says "Menu, button, expanded", since the menu shows. Click the button: the menu hides, and the screen reader says "Menu, button, collapsed". Click again: "expanded".

- When a page opens, the menu shows, and `#menu-button` has `aria-expanded="true"`.
- Each click sets it to `"false"` when the menu hides, and back to `"true"` when it shows again, on every page.
- A page without the button still shows no error.

Psst, it's `aria-expanded`, not `aria-pressed`: the button opens a menu :)
