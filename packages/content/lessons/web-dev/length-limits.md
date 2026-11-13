A game asks for your nickname. One letter? Too short: nobody knows which player is which. A whole sentence? It won't fit on the scoreboard. A box can say how short and how long an answer may be.

## `maxlength`: the most

`maxlength` is the most characters a box takes. A character is any letter, digit, space or sign:

```html preview
<label for="nickname">Nickname (up to 12 characters)</label><br />
<input id="nickname" maxlength="12" />
```

Type a long nickname: after 12 characters, the box takes no more. Say the limit in the label, or the visitor thinks the keyboard is broken.

It works on a textarea too:

```html preview
<label for="review">Your review (up to 100 characters)</label><br />
<textarea id="review" rows="3" maxlength="100"></textarea>
```

## `minlength`: the least

`minlength` is the fewest characters a box needs before the form is sent:

```html preview
<form>
  <label for="nickname">Nickname (3 to 12 characters)</label><br />
  <input id="nickname" name="nickname" minlength="3" maxlength="12" />
  <button>Join</button>
</form>
```

Type `Al` and click **Join**. Nothing is sent, and the browser says to use at least 3 characters. Type `Ali`, and it is sent.

There's one surprise: an empty box is still sent. `minlength` checks only what was typed. For a box that can't stay empty, add `required` too.

## Break it on purpose

Swap the two numbers:

```html preview
<form>
  <label for="nickname">Nickname</label><br />
  <input id="nickname" name="nickname" minlength="12" maxlength="3" />
  <button>Join</button>
</form>
```

Type a nickname and send. The box stops at 3 characters, but the form wants 12: no nickname can ever be sent. The browser doesn't warn you about limits that make no sense. Read your numbers twice.

---

## Mission: Not too short, not too long

Your name box takes one letter, or a whole book, and so does the notes box. The station's tickets have room for 40 characters of a name, and its crew read short notes only.

**Example**: type a name of more than 40 characters: the box stops at the 40th. Fill in the rest of the form with a name of one letter and send: nothing is sent.

- A name has at least 2 characters and at most 40: the box takes no more than 40, and the form isn't sent with only 1.
- The notes take at most 200 characters.

Psst, the limits count characters, spaces too, not words :)
