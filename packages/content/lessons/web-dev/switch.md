A snack machine has a code for each slot: A1 gives water, A2 gives juice, B1 gives chips. You type a code, and the machine finds the slot that matches. One value, many possible answers, each written next to its code.

## `switch`

`switch` compares one value with a list of cases:

```js
const code = "A2";
switch (code) {
  case "A1":
    console.log("Water");
    break;
  case "A2":
    console.log("Juice");
    break;
  case "B1":
    console.log("Chips");
    break;
  default:
    console.log("No such slot");
}
```

```text
Juice
```

Here is how it reads:

1. `switch (code)` takes the value to compare: `"A2"`.
2. Each `case` holds a value. JavaScript compares the `switch` value with each one, using `===`, from the top, until one matches: `case "A2"`.
3. The lines under that case run, until `break`. `break` jumps out of the `switch`.
4. `default` runs when no case matches. Change the first line to `const code = "C9";`, and the console says `No such slot`.

It does the same job as an `else if` chain that asks `code === "A1"`, `code === "A2"`, and so on. When every question compares the same value, `switch` is easier to read.

## In a page

```html preview
<label for="day">Club day</label>
<select id="day">
  <option value="">Pick a day</option>
  <option value="mon">Monday</option>
  <option value="wed">Wednesday</option>
  <option value="fri">Friday</option>
</select>
<p>Activity: <span id="activity">Pick a day first</span></p>
<script>
  const day = document.querySelector("#day");
  const activity = document.querySelector("#activity");

  day.addEventListener("change", () => {
    switch (day.value) {
      case "mon":
        activity.textContent = "Chess";
        break;
      case "wed":
        activity.textContent = "Robots";
        break;
      case "fri":
        activity.textContent = "Movie night";
        break;
      default:
        activity.textContent = "Pick a day first";
    }
  });
</script>
```

Pick **Wednesday**: the page says `Activity: Robots`. Pick **Pick a day** again: no case matches, so `default` writes `Pick a day first`.

## Break it on purpose

Remove the `break` of `"A2"`:

```js
switch (code) {
  case "A1":
    console.log("Water");
    break;
  case "A2":
    console.log("Juice");
  case "B1":
    console.log("Chips");
    break;
  default:
    console.log("No such slot");
}
```

```text
Juice
Chips
```

Without `break`, JavaScript doesn't stop at the end of the case. It also runs the next case's lines, without checking its value, until it finds a `break`. So end every case with `break`.

---

## Mission: Where to?

Your pass shows the code of the flight, like `SL-102`. A passenger wants to read where it goes.

**Example**: when the page opens, the pass says `Going to: No flight yet`. Pick the flight `SL-102`, and it says `Going to: Mars Relay`.

- On the pass, an element with the id `pass-destination` shows where the flight picked goes, as the list says it: `Moon Base` for SL-101, `Mars Relay` for SL-102, `Europa Outpost` for SL-103, `Lunar Gateway` for SL-104 and `Orbital Yard` for SL-105.
- With no flight picked, it says `No flight yet`: when the page opens, and when the passenger picks **Pick a flight** again.
- `#pass-flight` still shows the code.

Psst, every case needs its `break` :)
