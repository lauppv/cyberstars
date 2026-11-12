A T-shirt comes in small, medium or large. You pick one size, never two. On a paper form, people sometimes tick two boxes by mistake. On a web page, there's a kind of button that makes that impossible.

## `type="radio"`

```html preview
<input type="radio" id="small" name="size" value="S" />
<label for="small">Small</label><br />
<input type="radio" id="medium" name="size" value="M" />
<label for="medium">Medium</label><br />
<input type="radio" id="large" name="size" value="L" />
<label for="large">Large</label>
```

Round buttons, each with its label. Click **Small**, then **Large**: Small goes off by itself. Only one can be on.

They're called **radio buttons**, after the buttons of old car radios: you push one station in, and the one pushed before jumps out.

## One name, one choice

What ties the buttons together is their `name`. All the round buttons with the same name are one question, and only one of them can be on. Each one has its own `value`, and the form sends the one that is on:

```html preview
<form>
  <input type="radio" id="small" name="size" value="S" />
  <label for="small">Small</label><br />
  <input type="radio" id="large" name="size" value="L" />
  <label for="large">Large</label><br />
  <button>Order</button>
</form>
```

Pick **Large** and click **Order**:

```text
The form was sent: size=L
```

Once one is on, a second click on it doesn't turn it off. To change your mind, you pick another one.

## Break it on purpose

Give each button a name of its own:

```html preview
<input type="radio" id="small" name="small" value="S" />
<label for="small">Small</label><br />
<input type="radio" id="medium" name="medium" value="M" />
<label for="medium">Medium</label><br />
<input type="radio" id="large" name="large" value="L" />
<label for="large">Large</label>
```

Click all three: all three are on, and you can't turn any of them off. Three names make three questions, each with only one answer.

---

## Mission: Window or aisle?

Your booking form asks about the extras, but not about the seat. A passenger sits either by the window or on the aisle, never both.

**Example**: two round buttons, such as "By the window" and "On the aisle". Pick the aisle and send: the console's line has `seat=aisle` in it.

- Two round buttons named `seat`, with the values `window` and `aisle`.
- Only one can be on at a time, and the form sends the one picked.
- Each has a label, and a click on the label picks its button.

Psst, both buttons get the same name :)
