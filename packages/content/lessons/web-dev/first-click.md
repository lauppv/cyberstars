A page that changes by itself is nice. But what JavaScript is really for is a page that answers the visitor. It starts with a click.

## A button

```html
<button type="button" id="open-doors">Open the doors</button>
```

A `<button>` is made to be pressed. Use one whenever something should happen on a click, not a `<div>` or a `<p>` made to look like a button. A real button can be reached with the Tab key and pressed with Enter or Space, and a screen reader says it's a button. `type="button"` means it's a plain button, not one that sends a form. Forms come later.

## Listening for the click

```js
const openDoors = document.querySelector("#open-doors");

openDoors.addEventListener("click", () => {
  console.log("Doors opening");
  bayStatus.textContent = "Doors open";
});
```

Something that happens on the page (a click, a key pressed, the window resized) is called an **event**. `addEventListener` asks an element to run some code every time an event happens to it. It takes two things:

- the event's name, `"click"`;
- the code to run, written as `() => { ... }`: a small piece of code saved for later. The browser runs what's between the braces every time the button is clicked, and not before.

That piece of code is called a **function**. Part 2 explains functions fully. For now, read `() => { ... }` as "when it happens, do this".

The line with `addEventListener` runs once, when the script starts. It only gets things ready. Nothing inside the braces runs until the first click.

---

## Mission: Wake-up Call

The night shift sleeps in the crew quarters. Give the home page a way to wake them.

- Under the status paragraph, add a button with the id `wake` that says **Wake the crew**.
- After a click on it, the status says `Crew awake`, and the console shows `Wake-up call sent`.
- Until someone clicks, the status still says all systems are normal.
