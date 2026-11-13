A shop's website asks for your postal code to find the nearest shop. Type `6900`, and it tells you at once that a postal code has five digits, before you go any further. A form can do this on its own, with a pattern: the browser refuses an answer that doesn't fit, as it refuses an empty `required` box.

## `pattern`

The `pattern` attribute puts a regex on a box. The browser then refuses to send the form while the box holds a text that doesn't fit:

```html preview
<form>
  <label for="postal">Postal code</label>
  <input id="postal" name="postal" pattern="\d{5}" />
  <button>Find my shop</button>
</form>
```

Type `6900` and click **Find my shop**. Nothing is sent: the browser points at the box, with a message like "Please match the requested format". Type `69001`:

```text
The form was sent: postal=69001
```

Two things are different from a regex in a script:

- No slashes. The pattern is the attribute's value, between its quotes: `pattern="\d{5}"`, not `pattern="/\d{5}/"`.
- No `^` and `$` needed. A `pattern` always checks the whole text, as if they were there. `690012` is refused.

The box gets `:invalid` too, so the styles you wrote for wrong answers show on it.

## An empty box passes

Clear the box and click again:

```text
The form was sent: postal=
```

`pattern` checks only what is typed. An empty box has nothing to check, so it passes. When the answer can't be left out, add `required`:

```html preview
<form>
  <label for="postal">Postal code</label>
  <input id="postal" name="postal" pattern="\d{5}" required />
  <button>Find my shop</button>
</form>
```

Now an empty box is refused, and so is `6900`. Only five digits get through.

## The script and the browser

Your script can test the same rule with a regex, to answer while the visitor types. `pattern` doesn't replace that: it decides whether the form may go. Many forms have both, with the same rule in each place.

## Break it on purpose

Write the slashes, as in a script:

```html preview
<form>
  <label for="postal">Postal code</label>
  <input id="postal" name="postal" pattern="/\d{5}/" required />
  <button>Find my shop</button>
</form>
```

Type `69001` and click: the browser refuses it. The slashes are now part of the pattern, so it only accepts a text like `/69001/`. In `pattern`, write only what goes between the slashes.

---

## Mission: Refused at the gate

Your pass already checks the badge number. But a passenger can still book with a wrong badge number, or none at all, and the station can't let them on board.

**Example**: fill in the form with the badge number `OS482` and click **Book my seat**. The browser points at the badge number box, and `#confirmation` stays empty. Fix it to `OS4821` and send again: the page says `Seat booked for Ida Moreau on SL-102`.

- The browser refuses the booking while the badge number isn't two capital letters and four digits, so no seat is booked.
- It refuses a booking with no badge number too.
- With a right badge number, the booking goes through as before.

Psst, no slashes in `pattern` :)
