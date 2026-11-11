A light switch: press it once, the light goes on; press it again, it goes off. Same button, two states, and it remembers which one it's in. Lots of buttons on the web work like that: mute, dark mode, show more.

## `classList.toggle`

`toggle` adds a class if it's not there, and removes it if it is:

```js
document.querySelector("#dark-mode").addEventListener("click", () => {
  document.querySelector("body").classList.toggle("dark");
});
```

First click: the body gets `dark`. Second click: it loses it. Third: gets it again. One line does the switching, and CSS does the rest:

```css
.dark {
  background-color: black;
  color: white;
}
```

`toggle` also gives back `true` when it has just added the class, and `false` when it has just removed it.

## Hiding with a class

To hide some elements, put a class on something around them, and let CSS do the hiding:

```css
.hide-done .done {
  display: none;
}
```

When the list has `hide-done`, its `.done` items are hidden. Toggle `hide-done`, and they come and go.

## Telling a screen reader

A toggle button looks pressed or not, but a screen reader can't see that. The attribute `aria-pressed` tells it: `"true"` when pressed, `"false"` when not.

```js
const on = document.querySelector("body").classList.toggle("dark");
button.setAttribute("aria-pressed", on);
```

## Break it on purpose

Use `add` instead of `toggle`. The first click works, the second does nothing: the class is already there. A switch needs `toggle`.

---

## Mission: Hide the cancelled

Passengers don't care about cancelled flights. A button hides them, and shows them again.

**Example**: over the flight table, a button says `Hide cancelled`. A click hides the cancelled flight, and the button says `Show cancelled`. A second click brings it back, and the button says `Hide cancelled` again.

- A button with the id `hide-cancelled`, saying `Hide cancelled`, with `aria-pressed="false"`.
- Each click toggles the class `hide-cancelled` on the flight table. While the table has it, the cancelled rows aren't shown.
- The button then says `Show cancelled`, with `aria-pressed` set to `true`. A second click puts both back.

Psst, `toggle` tells you whether it has just added the class :)
