On a paper form, every box has a word next to it: "Name", "Date", "Sign here". Without it, you'd have to guess what goes where. A box on a web page needs that word too, and HTML has a tag just for it.

## `<label>`

A **label** is the name of a box. Its `for` attribute says which box, by the box's `id`:

```html preview
<label for="city">Your city</label>
<input id="city" />
```

On the page it looks like plain text next to the box. But click the word "Your city": the box is ready to type in, as if you had clicked the box itself. Try it.

That's useful with a big finger on a small phone, but there's more. A screen reader, which reads the page out loud for people who can't see it, reads the label when the box gets the focus: "Your city, edit text". Without a label it only says "edit text", and the listener has no idea what to type.

## A label above its box

A label is inline, like a word. To put it on its own line, above the box, add a `<br />`:

```html preview
<label for="pet">Your pet's name</label><br />
<input id="pet" />
```

Later, CSS does this better.

## Break it on purpose

Make the `for` and the `id` different:

```html preview
<label for="town">Your city</label>
<input id="city" />
```

It looks exactly the same. But click "Your city" now: nothing happens. The label points at a box called `town`, and there is none. `for` and `id` must match, letter for letter.

---

## Mission: Name the box

Your `boarding.html` has a box for the passenger's name, with a plain line above it. Someone with a screen reader hears only "edit text".

**Example**: the page looks almost the same, but a click on the words above the box puts the cursor in the box, ready to type.

- The box with the id `passenger` has a label that says what to type in it.
- A click on the label puts the cursor in the box.

Psst, `for` takes the box's `id`, without a `#` :)
