"Open the box, take out the bag, and give me the key in it." If there's no box, you stop at the first step and say "there's no box". You don't try to open a bag that isn't there. JavaScript has a way to stop like that, in the middle of a line.

## A chain of dots

Some lines go through several steps with dots:

```js
const name = document.querySelector("#hero").textContent.trim();
```

Find the element, take its text, trim it. If there's no `#hero`, the first step gives `null`, and the second step stops everything:

```text
TypeError: Cannot read properties of null (reading 'textContent')
```

## `?.`: stop at nothing

`?.` works like a dot, but first it checks what's on its left. If that's `null` or `undefined`, it stops there and the whole chain gives `undefined`, with no error:

```js
const name = document.querySelector("#hero")?.textContent.trim();
console.log(name);
```

On a page without `#hero`:

```text
undefined
```

On a page with it, the chain goes on as usual, and `name` is the hero's text.

Put `?.` only where something might be missing. Here only the element might be missing: if it's there, it surely has a `textContent`, so the next dots stay plain dots.

## What comes back

After a `?.` chain, you have either the value or `undefined`. An `if` or a ternary decides what to do with each:

```js
const name = document.querySelector("#hero")?.textContent;
console.log(name ? `Our hero: ${name}` : "No hero today");
```

That's shorter than an `if` that checks for `null` first, and it reads in the order things happen.

## Break it on purpose

Put the `?.` one step too late: `document.querySelector("#hero").textContent?.trim()`. On a page without `#hero`, the error comes back: the plain dot after `querySelector(...)` already failed, before `?.` could check anything. The `?.` goes right after the thing that might be missing.

---

## Mission: The motion that's chosen

Under the motion buttons, the page should say which motion is chosen, from the button pressed in the HTML.

**Example**: under the motion buttons, the page says:

```text
Motion: full
```

- Under the motion buttons, a paragraph with the id `current-motion`.
- When the page opens, it says `Motion: ` and the motion of the button pressed in the HTML: the part of its id after `motion-`, so `full` or `less`. The `settings` object keeps it in a property, `motion`.
- When no motion button is pressed in the HTML, it says `Motion: not chosen`, and the page shows no error.

Psst, the `?.` goes right after the `querySelector(...)` that might find nothing :)
