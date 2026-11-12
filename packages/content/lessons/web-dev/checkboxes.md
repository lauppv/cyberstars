When you order a pizza, the menu asks: extra cheese? Mushrooms? Olives? You can say yes to none of them, to one, or to all three. Each one is a small yes or no, and a form asks them with little boxes you tick.

## `type="checkbox"`

A box to tick is `type="checkbox"`:

```html preview
<input type="checkbox" id="cheese" />
<label for="cheese">Extra cheese</label>
```

A small square. Click it: a tick appears. Click it again: the tick is gone. Now click the words: they tick the box too, because the label is tied to it, as it is to a text box. For a box to tick, the label usually comes right after it.

## `value`: what a ticked box sends

```html preview
<form>
  <input type="checkbox" id="cheese" name="toppings" value="cheese" />
  <label for="cheese">Extra cheese</label><br />
  <input type="checkbox" id="olives" name="toppings" value="olives" />
  <label for="olives">Olives</label><br />
  <button>Order</button>
</form>
```

Tick both boxes and click **Order**:

```text
The form was sent: toppings=cheese&toppings=olives
```

A ticked box sends its name and its `value`. A box that isn't ticked sends nothing at all: untick the olives and send again, and only `toppings=cheese` goes.

The boxes of one question share the same name, and each one has its own value. That's how the server knows they answer the same question.

## `checked`: ticked from the start

```html preview
<input type="checkbox" id="news" name="news" value="yes" checked />
<label for="news">Send me the club news</label>
```

`checked` makes a box start ticked. Like `defer`, it has no value: writing it is enough. The visitor can still untick it.

## Break it on purpose

Take the values away:

```html preview
<form>
  <input type="checkbox" id="cheese" name="toppings" />
  <label for="cheese">Extra cheese</label><br />
  <input type="checkbox" id="olives" name="toppings" />
  <label for="olives">Olives</label><br />
  <button>Order</button>
</form>
```

Tick both and send:

```text
The form was sent: toppings=on&toppings=on
```

A box without a value sends `on`. Which toppings? Nobody can tell.

---

## Mission: Extras on board

Your booking form asks who is flying, when, and with how many bags. The station also offers a few extras for the trip: a hot meal, a warm blanket, and Wi-Fi on board.

**Example**: three boxes, each with its words next to it, and Wi-Fi already ticked. Tick the meal and send: the console's line has `extras=meal&extras=wifi` in it.

- Three boxes, all named `extras`, with the values `meal`, `blanket` and `wifi`.
- Each box has a label, and a click on the label ticks or unticks it.
- Wi-Fi is free and most passengers want it, so its box starts ticked. The other two start empty.

Psst, the same name for all three, and a different value for each :)
