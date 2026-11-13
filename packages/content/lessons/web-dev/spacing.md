Look at a shelf in a supermarket. The cereals stand close together, then there's a gap, then the cookies. Nobody needs a sign that says "these belong together": the space says it. A form works the same way. A label close to its box, and more room before the next question.

## Room above, not below

Labels and boxes with no room between them all look like one long list:

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
<label for="city">City</label>
<input id="city" />
```

Now give each label some room above it, and only a little below:

```css preview
<style>
  /* show */
  label {
    display: block;
    margin-top: 16px;
    margin-bottom: 4px;
  }
  /* /show */
</style>
<label for="first">First name</label>
<input id="first" />
<label for="last">Last name</label>
<input id="last" />
<label for="city">City</label>
<input id="city" />
```

Each label moves away from the box above it and stays close to its own box. Your eye now reads pairs: "First name" and its box, "Last name" and its box.

## Groups need more room

A group (`fieldset`) holds several choices, so it needs room around it, more than a single label:

```css preview
<style>
  /* show */
  fieldset {
    margin-top: 24px;
    margin-bottom: 24px;
  }
  /* /show */
</style>
<fieldset>
  <legend>Pick a size</legend>
  <input type="radio" id="small" name="size" value="S" />
  <label for="small">Small</label>
  <input type="radio" id="large" name="size" value="L" />
  <label for="large">Large</label>
</fieldset>
<fieldset>
  <legend>Pick a color</legend>
  <input type="radio" id="red" name="color" value="red" />
  <label for="red">Red</label>
  <input type="radio" id="blue" name="color" value="blue" />
  <label for="blue">Blue</label>
</fieldset>
```

Remove the rule: the two frames touch, and look like one block. With it, each group stands on its own. Inside a group, the choices stay close.

## Break it on purpose

Put the room under the label instead of above it:

```css preview
<style>
  /* show */
  label {
    display: block;
    margin-bottom: 16px;
  }
  /* /show */
</style>
<label for="first">First name</label>
<input id="first" />
<label for="last">Last name</label>
<input id="last" />
<label for="city">City</label>
<input id="city" />
```

Now each label sits far from its box, and right under the box before it. "Last name" seems to belong to the first box. Room in the wrong place is worse than no room at all.

---

## Mission: Room between the groups

In your form, there's no room between a box and the next label, and the groups of choices touch each other.

**Example**: each label sits close to its box, with a clear gap before the next question. The groups of seats, of extras and of the contact have room above and below them, and the buttons have room above them.

- A label stays close to its box: at most 8 pixels between them.
- There are at least 16 pixels between a box and the next label, in the groups too.
- There are at least 16 pixels above and below each group, and above the send button.

Psst, the room goes above a label, not under it :)
