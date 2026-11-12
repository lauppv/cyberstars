"Date of birth": do you write `5 May 2010`, `05/05/2010` or `2010-05-05`? A short example of the answer, right in the box, saves the visitor the guess.

## `placeholder`

The `placeholder` attribute writes a hint inside an empty box, in light grey:

```html preview
<label for="phone">Phone number</label><br />
<input id="phone" placeholder="e.g. 555 0123" />
```

Click in the box and type a letter: the hint goes away. Delete what you typed: it comes back. The hint is never part of the answer. If the visitor types nothing, the box is still empty.

A good hint is an example of the answer, not the question again: `e.g. 555 0123`, not `Type your phone number`.

## Not instead of a label

A placeholder is not a label, even if it looks like one:

```html preview
<input id="email" placeholder="Email" />
```

It looks tidy, but:

- the hint goes away as soon as you type, so halfway through you can't check what the box was for;
- the light grey is hard to read for many people;
- some screen readers don't read it at all.

So keep the label, and use the placeholder only for the example.

## Break it on purpose

Put the hint in the box as its `value` instead:

```html preview
<label for="town">Town</label><br />
<input id="town" value="e.g. Lyon" />
```

Now it's dark, not grey, and it doesn't go away when you type: you have to delete it first. `value` is a real answer, already typed in. A hint belongs in `placeholder`.

---

## Mission: An example name

Passengers wonder how to write their name: first name first? Capital letters?

**Example**: the box under "Full name" shows a made-up name in grey, such as `e.g. Ida Moreau`, which goes away as soon as you type.

- The box with the id `passenger` shows a hint with an example name, and keeps its label.
- The box starts empty: the hint is not a value.

Psst, a placeholder is an attribute of the `input`, like `id` :)
