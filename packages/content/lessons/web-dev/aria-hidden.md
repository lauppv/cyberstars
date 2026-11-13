A shop sign shows a small cup next to the word "Café". The cup helps you spot the shop from across the street. But if a friend reads the sign to you on the phone, they say "Café", not "picture of a cup, Café". Some things on a page are only for the eye, and a screen reader should skip them.

## Icons are read too

A screen reader reads every character, symbols too:

```html preview
<button type="button">★ Favourites</button>
```

It says something like "black star, Favourites, button". The star helps people who see it, but read out loud it's noise. And with an emoji, it's often a long name, like "smiling face with sunglasses".

## `aria-hidden="true"`

`aria-hidden="true"` hides an element from screen readers, and only from them. The page looks exactly the same. Put the icon in a `<span>` of its own, so you can hide it alone:

```html preview
<button type="button"><span aria-hidden="true">★</span> Favourites</button>
```

The eye still sees the star. A screen reader says just "Favourites, button".

## Only what the eye doesn't need to say

`aria-hidden` is for things that add nothing in words: an icon next to its word, a decoration, a line between parts. Never use it on something that has meaning only you can see: an icon **alone** in a button, with no word next to it, would leave a button with no name at all.

For a picture, you know the other way: `alt=""` on an `<img>` that's only decoration. `aria-hidden` does the same for anything else.

## Break it on purpose

Put `aria-hidden="true"` on the whole button:

```html
<button type="button" aria-hidden="true">★ Favourites</button>
```

The button still shows and still works with a mouse. But for a screen reader, it's gone: a blind visitor never learns it exists, and can even land on it with Tab and hear nothing. Then hide the word along with the icon, `<span aria-hidden="true">★ Favourites</span>`: the button has no name left. Hide the icon alone.

---

## Mission: Icons for the themes

The theme buttons are plain words. An icon would make them easier to spot, without making screen readers say more.

**Example**: the buttons read `☀ Light`, `☾ Dark` and `System`.

- The Light button and the Dark button each get an icon before their word. The icons are yours.
- A screen reader skips the icons, and still reads each button's word: Light, Dark, System.
- The buttons themselves stay readable by screen readers, the System button still pressed.

Psst, hide the icon in a `<span>` of its own, not the word :)
