At a museum, a guide doesn't just say "the next painting is somewhere in this room". They walk you to it. People who use a keyboard move through a page one element at a time, with Tab. When a click changes something somewhere else on the page, a script can take their keyboard straight to it.

## The focus

The **focus** is where the keyboard is: the element that Enter presses, or that gets the letters you type. It shows as a ring round a button or a field. Tab moves it to the next element, Shift+Tab to the one before.

When a click changes the page, the focus stays on the button that was clicked. For someone with a mouse, that's fine: they see the change and move the mouse there. For someone with a keyboard, or a screen reader, the change happened somewhere else, and they may have to press Tab many times to find it.

## `focus()`

An element's `focus()` method moves the focus to it:

```html preview
<button type="button" id="new-game">New game</button>
<p>Your name: <input id="player-name" /></p>
<script>
  document.querySelector("#new-game").addEventListener("click", () => {
    const field = document.querySelector("#player-name");
    field.value = "";
    field.focus();
  });
</script>
```

Click "New game": the field empties, and the focus jumps into it, so you can type your name straight away, with no click and no Tab. Try it with the keyboard only: Tab to the button, press Enter, and type.

## What can take the focus

Buttons, links and form fields can take the focus by themselves. A paragraph or a heading can't: `focus()` on them does nothing. So move the focus to something the visitor can use next: a field to fill in, or the button that was just chosen.

## Break it on purpose

Forget the brackets: `field.focus;`. Nothing happens: the method is named, not called, so the focus stays on the button. Then call `focus()` before you empty the field and change the page. It works, but a screen reader may read the old content first. Move the focus last, once the page is ready.

---

## Mission: Where the keyboard goes

On the settings page, two buttons change the theme from far away: "Forget my settings" and "Use these settings". With a keyboard, you then have to Tab all the way back up to see the theme buttons.

**Example**: with the keyboard, press "Forget my settings": the focus ring jumps to the System button. Bring settings with the Dark theme: the focus ring is on the Dark button.

- After a click on `#reset-settings`, the focus is on the System button.
- After bringing settings with `#import-button`, the focus is on the button of the theme they chose.
- It works with the keyboard only, Enter on those buttons, as with the mouse.

Psst, move the focus last, once the page shows the new settings :)
