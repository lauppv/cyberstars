When a website asks which city you live in, it doesn't show you a hundred round buttons. It shows one small box. Click it, and a list drops down with every city in it.

## `<select>` and `<option>`

```html preview
<label for="city">City</label><br />
<select id="city">
  <option>Lyon</option>
  <option>Oslo</option>
  <option>Porto</option>
</select>
```

The `select` is the list, and each `option` is a choice in it. Click the box: the list opens. Pick a city: it shows in the box. With the keyboard, go to the box with Tab and press the up and down arrow keys.

The label works as for a text box: a click on "City" takes you to the list.

## `value`: what the form sends

The words of a choice are for people. The form can send something else, shorter and always the same, that the server knows: the option's `value`.

```html preview
<form>
  <label for="city">City</label><br />
  <select id="city" name="city">
    <option value="lyon">Lyon, France</option>
    <option value="oslo">Oslo, Norway</option>
    <option value="porto">Porto, Portugal</option>
  </select>
  <button>See the weather</button>
</form>
```

Pick Oslo and click the button:

```text
The form was sent: city=oslo
```

The page shows "Oslo, Norway", the form sends `oslo`. You can change the words on the screen whenever you like, and the server still gets the same values.

## An empty first choice

A list always shows a choice, the first one at the start. So Lyon looks picked already, and someone who doesn't look sends Lyon by mistake. An empty first choice asks the visitor to pick:

```html preview
<form>
  <label for="city">City</label><br />
  <select id="city" name="city">
    <option value="">Pick a city</option>
    <option value="lyon">Lyon, France</option>
    <option value="oslo">Oslo, Norway</option>
    <option value="porto">Porto, Portugal</option>
  </select>
  <button>See the weather</button>
</form>
```

Send without picking:

```text
The form was sent: city=
```

Its value is empty, so the server can tell nothing was picked.

## Break it on purpose

Leave out the `value` of the first choice:

```html preview
<form>
  <label for="city">City</label><br />
  <select id="city" name="city">
    <option>Pick a city</option>
    <option value="lyon">Lyon, France</option>
    <option value="oslo">Oslo, Norway</option>
  </select>
  <button>See the weather</button>
</form>
```

Send without picking:

```text
The form was sent: city=Pick a city
```

An option without a `value` sends its words. Now the server thinks someone lives in a city called "Pick a city".

---

## Mission: Which flight?

Your booking form doesn't ask which flight the passenger takes. The five flights are in your `schedule.html`, from SL-101 to SL-105.

**Example**: a list such as "Pick a flight". Open it: one choice for each flight, like "SL-103 to Europa Outpost, 07:15". Pick it and send: the console's line has `flight=SL-103` in it.

- A list with the id `flight`, sent as `flight`, with a label that takes you to it.
- It starts on an empty choice, so no flight is picked until the passenger picks one.
- Then one choice for each of the five flights: its value is the flight's code, such as `SL-103`, and its words say where the flight goes.

Psst, the empty choice needs an empty `value` too, or it sends its words :)
