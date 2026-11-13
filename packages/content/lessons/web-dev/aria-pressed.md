In a text editor, the **B** button makes your text bold. While bold is on, the button stays pressed in, so you can see it's on. Press it again, and it pops back out. Some buttons on a page work like that: they're on or off. A screen reader should know which.

## A button that is on or off

You can make a pressed button **look** pressed, with a class and some CSS. But a person who can't see the page hears only "Bold, button", and doesn't know if bold is on.

## `aria-pressed`

`aria-pressed` says whether a button is pressed in right now. It's `"true"` or `"false"`:

```html preview
<button type="button" aria-pressed="true">Bold</button>
<button type="button" aria-pressed="false">Italic</button>
```

The page looks the same as without it. But a screen reader now says "Bold, toggle button, pressed" and "Italic, toggle button, not pressed". A button with `aria-pressed`, even `"false"`, is read as a button that switches on and off.

Like `aria-expanded`, it's one of the few things HTML has no tag for, so ARIA is the right tool here.

## The look from the same attribute

A CSS attribute selector can pick the pressed button by its `aria-pressed`. Then what the screen reader says and what the eye sees always agree:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  button {
    background-color: #1e3a5f;
    color: #f0f4ff;
    padding: 8px 16px;
    border: 2px solid #2c4a7a;
    border-radius: 8px;
  }

  /* show */
  button[aria-pressed="true"] {
    background-color: #ffd166;
    color: #0b1d3a;
  }
  /* /show */
</style>
<button type="button" aria-pressed="true">Bold</button>
<button type="button" aria-pressed="false">Italic</button>
```

Bold is yellow, Italic isn't. Swap the two values in the HTML, and the yellow moves to Italic: there's no class to forget.

## Break it on purpose

Write `aria-pressed="yes"`. It's not one of the words ARIA knows, so the screen reader can't tell whether the button is pressed. And your CSS, which looks for `"true"`, doesn't color it either. Only `"true"` and `"false"` count.

Then leave `aria-pressed` out of the buttons that aren't pressed. A screen reader now reads them as plain buttons, not as switches that are off. Give it to every button of the group: `"true"` on one, `"false"` on the others.

---

## Mission: The theme that's on

On the settings page, the System theme is the one that counts today. Visitors and screen readers should both know it.

**Example**: the System button is yellow, pressed in, and the Light and Dark buttons are plain.

- The System button says it's pressed, and the Light and Dark buttons say they aren't, the way a screen reader understands.
- The pressed button looks different from the others, by its background, its text color, its border or its weight, taken from the same attribute: whichever button is pressed in the HTML gets that look.
- Every theme button's text is readable on its background, with a contrast of at least 4.5.

Psst, an attribute selector picks the button by what `aria-pressed` holds :)
