So far your oxygen numbers live in `crew.js`. But when the crew gets new tanks, they'd rather change the page than dig into a script. The numbers can live on the page, and the script can read them from there. There's one catch.

## Everything on the page is text

`textContent` always gives a string, even when it looks like a number:

```html preview
<p>Members: <span id="members">12</span></p>
```

```js
const members = document.querySelector("#members").textContent;
console.log(members + 1);
```

```text
121
```

`members` is the string `"12"`, so `+ 1` joins: `"121"`. To do maths with it, it must become a real number first.

## `Number()`

```js
const members = Number(document.querySelector("#members").textContent);
console.log(members + 1);
```

```text
13
```

`Number("12")` turns the string into the number 12. Now `+` adds.

## `NaN`: not a number

What if the text isn't a number at all?

```js
console.log(Number("twelve"));
```

```text
NaN
```

`NaN` means **Not a Number**: JavaScript tried, and couldn't. Any sum with `NaN` in it gives `NaN` too. When `NaN` shows up on your page, look at the text you turned into a number: a stray word, or the wrong element.

## Break it on purpose

Read the whole paragraph instead of the span:

```js
const members = Number(document.querySelector("p").textContent);
```

`NaN`: the text is "Members: 12", and "Members:" isn't a number. That's why numbers on a page sit in a `span` of their own: so a script can read just the number.

---

## Mission: Oxygen on the page

The oxygen numbers move from `crew.js` to `crew.html`, where the crew can change them.

**Example**: `crew.html` shows, under the status line:

```text
Oxygen tanks: 7, each lasting 20 hours.
Oxygen lasts 140 hours
```

- `crew.html` has a paragraph with the number of tanks in a `span` with the id `tanks`, and the hours per tank in a `span` with the id `tank-hours`.
- Under it, the script writes in a paragraph with the id `oxygen` how many hours the oxygen lasts, worked out from those two numbers: `Oxygen lasts 140 hours`.
- When the numbers on the page change, so does the sentence.

Psst, `textContent` is text: turn it into a number first :)
