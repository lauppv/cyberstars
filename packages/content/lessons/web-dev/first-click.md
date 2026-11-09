A doorbell does nothing until someone presses it. Then it rings. Most of what happens on a web page works like that: nothing until the visitor does something, a click, a tap, a key. Then the page reacts.

## A button

First, something to click. HTML has a tag for it:

```html
<button type="button" id="hello">Say hello</button>
<p id="answer"></p>
```

A button on its own does nothing when clicked. `type="button"` says it's a plain button. You'll meet other kinds with forms, later.

## `addEventListener`

A click is an **event**: something that happens. You ask an element to listen for it, and say what to do when it happens:

```js
const button = document.querySelector("#hello");
const answer = document.querySelector("#answer");

button.addEventListener("click", () => {
  answer.textContent = "Hello there!";
});
```

Read it like a sentence: "button, listen for a click, and when it happens, do this". The `() => { ... }` is the "do this" part: a little block of lines that doesn't run now, but **later**, every time the button is clicked.

When the page opens, nothing happens. Click the button, and the paragraph says "Hello there!".

## Break it on purpose

Spell the event wrong:

```js
button.addEventListener("clik", () => {
  answer.textContent = "Hello there!";
});
```

No error, and nothing happens on a click. The button is now listening for an event called "clik", which never happens. Event names are exact: `"click"`.

---

## Mission: Wake the crew

The morning alarm on the crew directory is a button.

**Example**: under the status line, a button says `Wake the crew`. Click it, and the status line changes to:

```text
The crew is awake
```

- `crew.html` has a button with the id `wake`, saying `Wake the crew`.
- A click on it writes `The crew is awake` in the status line, `#status`.
- Before the click, the status line still says `Directory checked`.

Psst, the lines inside `() => { }` run on the click, not before :)
