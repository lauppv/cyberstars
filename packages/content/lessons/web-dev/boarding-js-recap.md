No new theory, just a challenge that uses what this part's JavaScript taught: reading a box, the `input` and `change` events, `submit` and `preventDefault`, `trim`, `includes` and its friends, `slice` and `indexOf`, regular expressions and `test`, `pattern`, a message next to its box, `setCustomValidity`, `aria-describedby` and `aria-invalid`.

This time nobody tells you which lines to write. Read what the passenger needs, and put it together yourself. When you're not sure how to do a part, open the lesson it comes from again.

---

## Mission: Help with the badge

The browser refuses a wrong badge number, but only when the passenger clicks **Book my seat**, and its bubble goes away after a moment. The station wants the badge number box to explain itself, in words that stay, as soon as the passenger leaves it.

**Example**: type `OS482` in the badge number box, then press Tab to go to the next box. Right under the badge number box, the page says:

```text
Two capital letters and four digits, like OS4821
```

Go back, fix it to `OS4821`, and leave the box again: the message is gone.

- An element with the id `badge-error`, right after the badge number box, is empty when the page opens. When the passenger leaves the badge number box with a number that isn't two capital letters and four digits, it says `Two capital letters and four digits, like OS4821`.
- When the passenger leaves the box with a right number, the message goes away.
- A screen reader reads the message with the badge number box, and hears that the box is wrong while the message shows, and only then.
- Everything else on the form and on the pass works as before.

Psst, a form the browser refuses never fires its `submit` event :)
