At a restaurant, the waiter asks: "What would you like to drink?" If you say nothing, you get water. But if you say "nothing, thanks", that's an answer: you get no drink. "Nothing given" and "given nothing" aren't the same. JavaScript has a fallback that knows the difference.

## `||` falls back on every falsy value

You know `||` from the Boarding Form: it gives the left value, or the right one when the left counts as false:

```js
const typed = "";
console.log(typed || "Guest");
```

```text
Guest
```

Good for an empty name. But `||` replaces **every** value that counts as false: `""`, `0` and `false` too:

```js
const lives = 0;
console.log(`Lives left: ${lives || 3}`);
```

```text
Lives left: 3
```

The player has 0 lives left, a real answer, and `||` throws it away for the 3.

## `??`: falls back only on nothing

`??` gives the left value, unless it's `null` or `undefined`, the two kinds of nothing. Then it gives the right one:

```js
const lives = 0;
console.log(`Lives left: ${lives ?? 3}`);

let missing;
console.log(`Lives left: ${missing ?? 3}`);
```

```text
Lives left: 0
Lives left: 3
```

0 is a value, so it stays. Only `undefined` gets the fallback. That's why `??` is called the **nullish** fallback: it only steps in for `null` or `undefined`.

## With `?.`

`?.` gives `undefined` when something is missing, and `??` then gives the value to use instead. The two often come together:

```js
const name = document.querySelector("#hero")?.textContent ?? "No hero";
```

And a property an object doesn't have is `undefined` too, so `??` gives it a fallback: `labels[theme] ?? theme` uses the theme's words when it has some, and its name otherwise.

## Break it on purpose

Use `||` for the lives, as above: a player with 0 lives sees 3. Nothing fails, so the mistake can hide for a long time. Ask yourself whether `0`, `""` or `false` could be real answers. If they could, use `??`.

---

## Mission: Fallbacks

Two things can still come out wrong on the settings page. A theme button added later, like "High contrast", has no words in the `settings` object, so the page would say `Theme: undefined`. And when no motion button is pressed in the HTML, the page says `Motion: not chosen`, though the site still moves as usual.

**Example**: with a pressed "High contrast" button whose id is `theme-contrast`, the page says `Theme: contrast`. With no motion button pressed, it says `Motion: full`.

- When the chosen theme has no words in the `settings` object, `#current-theme` shows `Theme: ` and the theme's name. The themes that have words keep their words.
- When no motion button is pressed in the HTML, the motion is `full`, and `#current-motion` says `Motion: full`.

Psst, `??` steps in only for `null` and `undefined` :)
