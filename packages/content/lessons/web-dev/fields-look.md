Fill in a form on a website, and look closely at the boxes. Often the letters you type are smaller and plainer than the rest of the page, as if the boxes came from another website. They did, in a way: the browser gives boxes and buttons a font of its own.

## A box keeps the browser's font

```css preview
<style>
  /* show */
  body {
    font-family: Georgia, serif;
    font-size: 20px;
  }
  /* /show */
</style>
<label for="team">Team name</label><br />
<input id="team" placeholder="e.g. Red Rockets" />
<button>Join</button>
```

The label is in Georgia, at 20 pixels, like the rest of the page. Now type in the box: your letters are small, and in another font. The word on the button too.

Why? The browser has a rule of its own for boxes and buttons, with its own font. You saw in the Inheritance lesson that an element's own rule beats what it would inherit. So the page's font reaches the label, but not the box and the button.

## `inherit`

`inherit` is a value that means "the same as my parent". So `font-family: inherit` on a box gives it the font of the element around it, and `font-size: inherit` gives it the same size.

## `font: inherit`

`font` sets all the font's properties at once: the family, the size, the weight, the style and the line height. With `inherit`, all of them come from the parent:

```css preview
<style>
  body {
    font-family: Georgia, serif;
    font-size: 20px;
  }

  /* show */
  input,
  button {
    font: inherit;
  }
  /* /show */
</style>
<label for="team">Team name</label><br />
<input id="team" placeholder="e.g. Red Rockets" />
<button>Join</button>
```

Type in the box again: your letters now look like the label's. The button too. And if you change the page's font one day, the box and the button follow it.

A list (`select`) and a box for a longer text (`textarea`) have the same problem. That's why this rule usually names all four: `input, select, textarea, button`.

## Break it on purpose

Put the rule on the form, not on the boxes:

```css preview
<style>
  body {
    font-family: Georgia, serif;
    font-size: 20px;
  }

  /* show */
  form {
    font: inherit;
  }
  /* /show */
</style>
<form>
  <label for="team">Team name</label><br />
  <input id="team" placeholder="e.g. Red Rockets" />
  <button>Join</button>
</form>
```

Nothing changes. The form already had the page's font. The box inside it still has the browser's rule, and that rule still beats what the box would inherit. `inherit` must go on the boxes themselves.

Try `font-family: inherit` alone on the boxes too: the font is right, but the letters stay small. The size needs `inherit` as well, and `font` does both.

---

## Mission: One font for the whole site

Your `boarding.html` has a whole booking form. But the text in its boxes, in its flight list and on its buttons is smaller and plainer than the labels. The buttons of the crew page and of the schedule have the same problem.

**Example**: type a name in the name box: your letters look like the label above it, in the same font and at the same size. On the crew page, the words on Wake the crew are in the page's font too.

- Every box, list and button of the booking form shows its text in the page's font, at the same size as the labels.
- The buttons of the other pages too.
- If the page's font changes one day, they follow it.

Psst, a box doesn't take the font of the form around it: the rule goes on the boxes themselves :)
