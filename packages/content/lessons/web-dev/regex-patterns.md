A time on a clock always looks the same: two digits, a colon, two digits, like `09:45`. You can tell at once that `9:4` or `09:450` isn't a time, even if you have never seen those numbers before. You know its **shape**. A regex can describe a shape too.

## `\d`: any digit

`\d` matches one digit, any of `0` to `9`:

```js
console.log(/\d/.test("Room 7"));
console.log(/\d/.test("Room seven"));
```

```text
true
false
```

## `[ ]`: one of these

Square brackets match **one** letter from a list. `[abc]` matches an `a`, a `b` or a `c`. A dash gives a range: `[A-Z]` is any capital letter, `[a-z]` any small letter, `[0-9]` any digit, like `\d`:

```js
console.log(/[A-Z]/.test("hello"));
console.log(/[A-Z]/.test("hello Sofia"));
```

```text
false
true
```

## `{ }`: how many

A number in curly brackets says how many times the thing before it comes, one right after the other. `\d{4}` is four digits:

```js
console.log(/\d{4}/.test("Born in 2011"));
console.log(/\d{4}/.test("Room 12"));
```

```text
true
false
```

## `^` and `$`: the whole text

So far, a pattern looks for a match **anywhere** in the text. That's often too kind:

```js
console.log(/\d{2}:\d{2}/.test("09:45"));
console.log(/\d{2}:\d{2}/.test("109:450"));
```

```text
true
true
```

`109:450` holds `09:45` inside it, so it matches. `^` means "the start of the text" and `$` "the end of the text". Between them, the pattern must be the **whole** text:

```js
console.log(/^\d{2}:\d{2}$/.test("09:45"));
console.log(/^\d{2}:\d{2}$/.test("109:450"));
```

```text
true
false
```

## In a page

Lyon's postal codes are five digits, like `69001`:

```html preview
<label for="postal">Postal code</label>
<input id="postal" />
<p id="shape">Five digits, please</p>
<script>
  const postal = document.querySelector("#postal");
  const shape = document.querySelector("#shape");

  postal.addEventListener("input", () => {
    if (/^\d{5}$/.test(postal.value)) {
      shape.textContent = "Looks like a postal code";
    } else {
      shape.textContent = "Five digits, please";
    }
  });
</script>
```

Type `6900`: `Five digits, please`. Type one more digit: `Looks like a postal code`. A sixth digit, or a letter anywhere, and it says `Five digits, please` again.

## Break it on purpose

Remove the `^` and the `$`:

```js
if (/\d{5}/.test(postal.value)) {
```

Type `690012345`: the page says `Looks like a postal code`. There are five digits in a row inside it, and nothing says the text must stop there. When a pattern checks a whole answer, it starts with `^` and ends with `$`.

---

## Mission: Your badge

Everybody on the station wears a badge, and every badge has a number: two capital letters and four digits, like `OS4821`. The station wants it on the booking.

**Example**: under the email box, a new box asks for the badge number. When the page opens, the pass says `Badge: No valid badge yet`. Type `OS4821`: it says `Badge: OS4821`. Type `OS482`: `No valid badge yet` again.

- In the form, right after the email box, a box with the id `badge-number` and the name `badge`, with its label.
- On the pass, an element with the id `pass-badge` shows the number as it's typed, while it is exactly two capital letters and four digits. Otherwise, and while the box is empty, it says `No valid badge yet`.
- `os4821`, `OS48215` and `XOS4821` aren't badge numbers.

Psst, the whole number must fit the pattern, from its start to its end :)
