Is 03/04 the 3rd of April or the 4th of March? It depends on the country. People write dates in many ways, and when a form sends one, the server can't ask what you meant.

## `type="date"`

A box for a date is `type="date"`:

```html preview
<label for="party">Party day</label><br />
<input type="date" id="party" />
```

The box shows the parts of a date, and a small calendar button. Click it: a calendar opens, and you pick the day. You can also click a part and type it. On a phone, a calendar or a date wheel opens.

The order of the parts on the screen follows the language of your computer. Someone in Lyon sees the day first, someone in New York sees the month first. Each person reads the date the way they're used to.

## The value it sends

Now put the box in a form, with a name:

```html preview
<form>
  <label for="party">Party day</label><br />
  <input type="date" id="party" name="party" />
  <button>Invite</button>
</form>
```

Pick the 14th of May 2031 and click **Invite**:

```text
The form was sent: party=2031-05-14
```

Whatever the box shows, the form always sends the date the same way: the year, the month, then the day, with dashes. Four digits, two, two. Someone in Lyon and someone in New York send exactly the same text, so the server never has to guess.

## Break it on purpose

Use a plain text box for the date:

```html preview
<form>
  <label for="party">Party day</label><br />
  <input id="party" name="party" />
  <button>Invite</button>
</form>
```

Type `03/04` and send:

```text
The form was sent: party=03/04
```

March or April? Nobody can tell. And the next guest types `next Friday`. A date box doesn't allow that: every date it sends looks the same.

---

## Mission: Which day?

Your booking form asks for the name, the email, the phone and the bags, but not the day of the trip.

**Example**: a box such as "Travel date", with a calendar button. Pick the 14th of May 2031 and send: the console's line has `date=2031-05-14` in it.

- A date box with the id `travel-date`, sent as `date`, with a label that puts the cursor in it.
- The form sends the day picked, as year-month-day.

Psst, an id and a name don't have to be the same word: here the id is `travel-date` and the name is `date` :)
