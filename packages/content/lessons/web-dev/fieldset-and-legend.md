On a paper form, a question in bold often sits over its answers: "How did you hear about us?", and under it, a few boxes to tick. Without the question, the boxes make no sense. On a web page, a plain line of text over the boxes works for people who see the page, but not for everyone.

## `<fieldset>` and `<legend>`

A `fieldset` goes around a group of choices, and its `legend` is the question:

```html preview
<fieldset>
  <legend>Pick a size</legend>
  <input type="radio" id="small" name="size" value="S" />
  <label for="small">Small</label><br />
  <input type="radio" id="large" name="size" value="L" />
  <label for="large">Large</label>
</fieldset>
```

The browser draws a frame around the group, and writes the question in the frame's top line. The legend comes first, right after `<fieldset>`.

## What a screen reader hears

A screen reader reads each choice together with its question: "Pick a size, group. Small, radio button, 1 of 2." The listener knows what the choice is about, even after jumping straight to it.

A form can have many groups. Each one gets its own fieldset and its own question:

```html preview
<fieldset>
  <legend>Pick a size</legend>
  <input type="radio" id="small" name="size" value="S" />
  <label for="small">Small</label><br />
  <input type="radio" id="large" name="size" value="L" />
  <label for="large">Large</label>
</fieldset>
<fieldset>
  <legend>Pick a color</legend>
  <input type="radio" id="red" name="color" value="red" />
  <label for="red">Red</label><br />
  <input type="radio" id="blue" name="color" value="blue" />
  <label for="blue">Blue</label>
</fieldset>
```

Two frames, two questions. Nothing changes in what the form sends: a fieldset only groups.

## Break it on purpose

Write the question as a paragraph inside the frame:

```html preview
<fieldset>
  <p>Pick a size</p>
  <input type="radio" id="small" name="size" value="S" />
  <label for="small">Small</label><br />
  <input type="radio" id="large" name="size" value="L" />
  <label for="large">Large</label>
</fieldset>
```

The words sit inside the frame, on a line of their own, and the frame's top line is empty. Worse, a screen reader now reads "Small, radio button" with no question. Only a `legend` is the group's question.

---

## Mission: Questions over choices

Your booking form has a line such as "Seat:" over the round buttons, and "Extras:" over the boxes. A screen reader reads them as plain text, not as part of the choices.

**Example**: the two seats in a frame, with a question such as "Where would you like to sit?" in its top line, and the three extras in a second frame with a question of their own.

- The two seat buttons are in a group with a question over it, and nothing else is in that group.
- The three extras are in another group, with its own question.
- The seat and the extras are still sent as before.

Psst, the legend goes first, right after `<fieldset>` :)
