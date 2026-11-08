A page that changes on its own is nice. A page that answers the visitor is what JavaScript is really for. It starts with a click.

## A button

```html
<button type="button" id="open-doors">Open the doors</button>
```

A `<button>` is made to be pressed. Use one whenever something should happen on a click, rather than a `<div>` or a `<p>` made to look like a button: a real button can be reached with the Tab key and pressed with Enter or Space, and a screen reader announces it as a button. `type="button"` says it's a plain button, not one that sends a form; forms come later.

## Listening for the click

```js
const openDoors = document.querySelector("#open-doors");

openDoors.addEventListener("click", () => {
  console.log("Doors opening");
  bayStatus.textContent = "Doors open";
});
```

Something happening on the page, a click, a key pressed, the window resized, is an **event**. `addEventListener` asks an element to call some code each time an event happens to it. It takes two things:

- the event's name, `"click"`;
- the code to run, written as `() => { ... }`: a small piece of code kept for later. The browser runs what's between the braces every time the button is clicked, not before.

That piece of code is a **function**; part 2 tells you all about them. For now, read `() => { ... }` as "when it happens, do this".

The line with `addEventListener` runs once, when the script starts, and only sets things up. Nothing inside the braces runs until the first click.

---

## Mission: Wake-up Call

- Under the status paragraph, add a button with the id `wake` that says **Wake the crew**.
- When it's clicked, the status paragraph says `Crew awake`, and the console logs `Wake-up call sent`.
- Until then, the status keeps saying all systems are normal.
