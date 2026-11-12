You fill in a paper form, and then you hand it in. Until you do, nobody reads it. A box on a web page is the same: what you type stays in the box until something sends it. That something is a form.

## `<form>`

A `form` element goes around the boxes that are sent together, with a button at the end:

```html preview
<form>
  <label for="nickname">Nickname</label><br />
  <input id="nickname" />
  <button>Join</button>
</form>
```

Type a nickname, then click **Join**. A form is meant to go to a server, a computer somewhere that reads it. Here there's no server, so the line under the page says what the form would have sent.

Look at that line: nothing comes after the colon. The form was sent, but with nothing in it. The next lesson fixes that.

## Enter sends it too

Click in the box and press **Enter**: the form is sent, just like with the button. People expect that. A button inside a form sends it, and so does Enter in one of its boxes.

## Break it on purpose

Put the button outside the form:

```html preview
<form>
  <label for="team">Team</label><br />
  <input id="team" />
</form>
<button>Join</button>
```

Click **Join**: nothing happens. The button sends only the form it's inside. Enter in the box still works, because the box is in the form.

---

## Mission: Send it

The name box is there, but nothing sends what the passenger types.

**Example**: under the box, a button such as **Book my seat**. A click on it, or Enter in the box, sends the form, and the console under your page says `The form was sent:`.

- The label, the name box and a button are inside a form.
- The button sends the form, and so does Enter in the name box.

Psst, the button goes inside the `<form>`, before `</form>` :)
