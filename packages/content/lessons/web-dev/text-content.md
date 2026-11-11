At a train station, the departures board changes on its own: a train's time, then "Delayed", then "Boarding". Nobody repaints the board. A program changes the words. Now that your script can find an element, it can read its words and change them too.

## Reading: `textContent`

`textContent` is the text inside an element:

```js
const heading = document.querySelector("h1");
console.log(heading.textContent);
```

```text
My Favourite Games
```

Now the console shows the heading's words, not just `<h1>`.

## Writing: give it a new value

Put a new string in `textContent`, and the page changes:

```js
const note = document.querySelector("#note");
note.textContent = "The club is open today";
```

Whatever the element said before, it now says "The club is open today". The page shows it at once.

A common way to use it: an empty element in the HTML, waiting to be filled:

```html
<p id="note"></p>
```

The paragraph shows nothing until the script writes in it.

## The page changed, the file didn't

Open your `.html` file: it still says what it said. JavaScript changes the page **in the browser**, not your files. Reload, and the script runs again from the start.

## Break it on purpose

Write to an element that isn't there:

```js
document.querySelector("#notes").textContent = "Open today";
```

```text
TypeError: Cannot set properties of null (setting 'textContent')
```

`querySelector` found nothing, so it gave `null`, and `null` has no text to set. When you see "of null", check the selector before it.

Remember why scripts are deferred: this only works once the page has been read.

---

## Mission: Status line

The crew directory gets a status line, written by its script.

**Example**: `crew.html` shows, under its first paragraph:

```text
Directory checked
```

And the console shows, among its other lines, the page's biggest heading, word for word.

- `crew.html` has an empty paragraph with the id `status`, under its first paragraph. Later lessons use it.
- When the page opens, the script writes `Directory checked` in it.
- The console shows the text of the page's biggest heading, read from the page.

Psst, `textContent` is a property: no brackets :)
