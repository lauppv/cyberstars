Look at a paper form at school or at the doctor's: each question sits on its own line, with the space for the answer right under it. Your eye goes straight down the page. So far your form did this with `<br />`. But a line break is meant for text, like the lines of an address. Where things sit on the page is a job for CSS.

## Without `<br />`

A label sits inside a line, like a word. A box does too. Without `<br />`, they all run on one line:

```html preview
<label for="first">First name</label>
<input id="first" />
<label for="last">Last name</label>
<input id="last" />
```

Everything is on one line, until it runs out of room. Hard to read.

## A label on its own line

You met `display: block` in the Display lesson: a block takes a row of its own. Give it to the labels:

```css preview
<style>
  /* show */
  label {
    display: block;
  }
  /* /show */
</style>
<label for="first">First name</label>
<input id="first" />
<label for="last">Last name</label>
<input id="last" />
```

Each label now has a row of its own. Its box goes on the next line, and the next label, a block too, starts a new line under the box. One box a line, and not one `<br />`.

## A box for a longer text

A button after a `textarea` sits next to it, on the same line:

```css preview
<style>
  label {
    display: block;
  }

  /* show */
  textarea {
    display: block;
  }
  /* /show */
</style>
<label for="message">Your message</label>
<textarea id="message" rows="3"></textarea>
<button>Send</button>
```

With the rule, the button goes under the box. Remove the rule and look: the button moves up, to the right of the box.

## Choices stay side by side

A round button and its label belong together, on one line. But `label { display: block; }` picks every label, theirs too:

```css preview
<style>
  /* show */
  label {
    display: block;
  }
  /* /show */
</style>
<p>Your size</p>
<input type="radio" id="small" name="size" value="S" />
<label for="small">Small</label>
<input type="radio" id="large" name="size" value="L" />
<label for="large">Large</label>
```

Each label falls under its round button, alone on its line. Which button is Small? Hard to say. A label right after a round button must stay inline:

```css preview
<style>
  /* show */
  label {
    display: block;
  }

  input[type="radio"] + label {
    display: inline;
  }
  /* /show */
</style>
<p>Your size</p>
<input type="radio" id="small" name="size" value="S" />
<label for="small">Small</label>
<input type="radio" id="large" name="size" value="L" />
<label for="large">Large</label>
```

`input[type="radio"] + label` is "a label right after a round button": an attribute selector and `+`, from part 3. It's more specific than `label`, so it wins. The choices now sit side by side, each next to its label.

## Break it on purpose

Keep the `<br />` and add the CSS:

```css preview
<style>
  /* show */
  label {
    display: block;
  }
  /* /show */
</style>
<label for="first">First name</label><br />
<input id="first" /><br />
<label for="last">Last name</label><br />
<input id="last" />
```

An empty line appears between each label and its box. The label already ends its row, so the `<br />` after it makes a second, empty one. When CSS does the job, the `<br />` must go.

---

## Mission: One question a line

Your booking form puts each label above its box with `<br />`. Move that job to CSS.

**Example**: the page looks almost the same. Each label is on its own line, with its box right under it. Each seat and each extra sits next to its label, and the two buttons are under the notes box. The choices of a group may now share one line. The form has no `<br />` left.

- Each label of a box is on its own line, with its box right under it, and the next label starts under that box. In the contact's group too.
- Each round button and each box to tick stays on the same line as its label.
- The buttons are under the notes box.
- The form holds no `<br />`: CSS does the work.

Psst, once every label is a block, look at the seats and the extras :)
