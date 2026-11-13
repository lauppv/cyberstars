Look in a drawer and find it empty. Now think of a drawer that was never built. Both give you nothing, but they're not the same nothing: one is a place that holds nothing, the other isn't there at all. JavaScript has two kinds of nothing too: `null` and `undefined`.

## `undefined`: nothing was ever given

`undefined` is what you get when a value was never set. You've met it a few times:

```js
let score;
console.log(score);

const pet = { name: "Rex" };
console.log(pet.age);

const colors = ["red", "green"];
console.log(colors[5]);
```

```text
undefined
undefined
undefined
```

A variable without a value, a property the object doesn't have, an index past the end of an array: all `undefined`. A function that returns nothing gives `undefined` too, and so does `find` when nothing matches.

## `null`: nothing, on purpose

`null` means "no value here", given on purpose. You rarely write it yourself, but the browser gives it. `querySelector` gives `null` when nothing on the page matches:

```js
console.log(document.querySelector("#does-not-exist"));
```

```text
null
```

The browser looked, and found no element: so, on purpose, no element.

## Checking for them

Both count as false in an `if`. To check for one exactly, compare with `===`:

```js
const button = document.querySelector("#save");
if (button !== null) {
  button.textContent = "Save now";
}
```

Without the check, on a page with no `#save`, `button.textContent` would stop the script with an error, as you saw with `find`. Check for `null` after a `querySelector` whenever the element might not be there.

## Break it on purpose

Check the wrong nothing: `if (button !== undefined)`. On a page without `#save`, `button` is `null`, and `null !== undefined` is true, so the code goes on and stops with an error. `querySelector` never gives `undefined`: it gives an element or `null`.

And read a property with a dot when its name is in a variable: `labels.theme` looks for a property called "theme", finds none, and gives `undefined`. That's what `labels[theme]` is for.

---

## Mission: The theme in words, from the HTML

`Theme: system` is the code's word. Visitors would rather read real words. And the page should start with whichever theme button is pressed in the HTML, not always with System.

**Example**: when the page opens, it says:

```text
Theme: Same as my device
```

Click Light, and it says `Theme: Light`.

- The `settings` object holds the words for each theme in an object of its own: `Light` for light, `Dark` for dark, and `Same as my device` for system. `#current-theme` shows `Theme: ` and the chosen theme's words.
- When the page opens, the theme is the one whose button is pressed in the HTML: the part of its id after `theme-`. When no theme button is pressed there, it's System, and the page shows no error.

Psst, `querySelector` gives `null` when nothing is pressed :)
