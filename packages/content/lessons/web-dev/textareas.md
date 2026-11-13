A box for a name is one short line, and that's enough. But what if a form asks "Tell us about your pet"? Some people write three words, others write a whole story. In a box of one line, most of the story would be hidden.

## `<textarea>`

A box for a longer text is a `textarea`:

```html preview
<label for="pet">Tell us about your pet</label><br />
<textarea id="pet"></textarea>
```

A bigger box, a few lines tall. Type a sentence, then press Enter: a new line starts. You can also drag the small corner at the bottom right to make the box bigger.

Unlike `input`, a textarea has a closing tag. The text between the two tags is the text the box starts with, so you usually leave it empty.

## `rows`: how many lines show

`rows` says how many lines the box shows at once:

```html preview
<label for="pet">Tell us about your pet</label><br />
<textarea id="pet" rows="6"></textarea>
```

Six lines now. Write more than six, and a scroll bar appears in the box.

With a `name`, a form sends a textarea like any other box:

```html preview
<form>
  <label for="pet">Tell us about your pet</label><br />
  <textarea id="pet" name="pet" rows="4"></textarea><br />
  <button>Send</button>
</form>
```

Write "She sleeps all day." and click **Send**:

```text
The form was sent: pet=She sleeps all day.
```

## Break it on purpose

Close the textarea the way you close an `input`:

```html preview
<label for="pet">Tell us about your pet</label><br />
<textarea id="pet" />
<p>Thank you for writing!</p>
```

The paragraph is gone, and the box is full of code: `<p>Thank you for writing!</p>`. A textarea can't close itself. The browser waits for `</textarea>`, and everything until then becomes the box's text.

---

## Mission: Anything else?

Some passengers have something to tell the station: they travel with a cat, they need help with their bags, they get cold. Your booking form has no room for that.

**Example**: a box such as "Anything we should know?", a few lines tall. Write "Window seat, please. I get cold." and send: the console's line ends with `notes=Window seat, please. I get cold.`

- A box for a longer text, with the id `notes`, sent as `notes`, with a label that takes you to it.
- It shows at least three lines at once, and starts empty.

Psst, `<textarea>` needs its closing tag :)
