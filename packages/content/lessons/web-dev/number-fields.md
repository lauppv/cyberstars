At the cinema, you buy tickets: one, two, maybe four. Never two and a half, and never minus one. A box that asks "how many?" should know that too.

## `type="number"`

A box for a number is `type="number"`:

```html preview
<label for="tickets">Tickets</label><br />
<input type="number" id="tickets" />
```

Two small arrows show in the box. Click them, or press the up and down arrow keys, and the number goes up or down by one. Try to type a letter: the box doesn't take it. On a phone, the keyboard shows digits.

## `min` and `max`

`min` is the smallest number the box takes, and `max` the biggest:

```html preview
<form>
  <label for="tickets">Tickets</label><br />
  <input type="number" id="tickets" name="tickets" min="1" max="4" />
  <button>Buy</button>
</form>
```

Click the arrows: they stop at 1 and at 4. Now type `9` and click **Buy**. Nothing is sent: the browser shows a small message that the number must be 4 or less. Type `3`, and it goes:

```text
The form was sent: tickets=3
```

## `step`

A number box takes whole numbers: 1, 2, 3. The `step` attribute changes how big each jump is. A runner who saves how far they ran wants halves too:

```html preview
<form>
  <label for="run">How far did you run? (km)</label><br />
  <input type="number" id="run" name="run" min="0" step="0.5" />
  <button>Save</button>
</form>
```

Click the up arrow a few times: 0, 0.5, 1, 1.5. Type `1.2` and save: not sent, and the browser gives the two closest numbers it takes, 1 and 1.5.

Without `step`, it's like `step="1"`: only whole numbers.

## Break it on purpose

Take the `max` away from the tickets:

```html preview
<form>
  <label for="tickets">Tickets</label><br />
  <input type="number" id="tickets" name="tickets" min="1" />
  <button>Buy</button>
</form>
```

Type `400` and click **Buy**:

```text
The form was sent: tickets=400
```

The browser had no limit to check, so 400 tickets went. Every limit you leave out is a number nobody checks.

---

## Mission: How many bags?

Your booking form asks for the name, the email and the phone. Each passenger may bring up to three bags, or none at all.

**Example**: a box such as "Number of bags", with small arrows. Type `2` and send: the console's line ends with `bags=2`. Type `4` and send: nothing is sent.

- A number box with the id `bags`, sent as `bags`, with a label that puts the cursor in it.
- It takes whole bags only, from 0 to 3: the browser doesn't send 4, -1 or 1.5.

Psst, a passenger with no bags at all is fine too :)
