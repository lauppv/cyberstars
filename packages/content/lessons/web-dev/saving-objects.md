Packing for a holiday, you don't carry each sock and each shirt to the car one by one. You put them all in one suitcase, close it, and carry that. At the hotel, you open it and take everything out. To save several values at once, a page can pack them the same way.

## `localStorage` keeps only texts

Save an object as it is, and look at what comes back:

```js
localStorage.setItem("player", { name: "Mia", level: 7 });
console.log(localStorage.getItem("player"));
```

```text
[object Object]
```

`setItem` turned the object into a text the only way JavaScript knows by itself: `[object Object]`. The name and the level are lost.

## Pack it with `JSON.stringify`

JSON is a text that keeps everything an object holds. Turn the object into JSON before you save it:

```js
const player = { name: "Mia", level: 7 };
localStorage.setItem("player", JSON.stringify(player));

console.log(localStorage.getItem("player"));
```

```text
{"name":"Mia","level":7}
```

The whole object is saved under one key, as one text.

## Unpack it with `JSON.parse`

When the page opens again, read the text and turn it back into an object:

```js
const saved = localStorage.getItem("player");
if (saved !== null) {
  const player = JSON.parse(saved);
  console.log(`${player.name} is at level ${player.level}`);
}
```

```text
Mia is at level 7
```

The level comes back as a number too, since JSON keeps numbers as numbers. Arrays work the same way: a whole list of things under one key.

Keep the check for `null`: on a first visit nothing is saved, and `JSON.parse(null)` would give `null`, with no properties to read.

## Break it on purpose

Forget `JSON.parse` when you read it back: `const player = saved;`. Then `player.name` is `undefined`: `player` is still the text `{"name":"Mia","level":7}`, letters and braces, not an object. What went in through `JSON.stringify` comes out through `JSON.parse`.

---

## Mission: Save all the settings

Only the theme is saved. The motion is part of the settings too, and more will come. All of them should be saved together.

**Example**: bring the settings `{"theme":"light","motion":"less"}`, then reload: the page says `Theme: Light` and `Motion: less`.

- Each time a theme is chosen, by its button or by bringing settings, the `settings` object saves its theme and its motion together, as one JSON text, under the key `settings`.
- When the page opens with saved settings, it reads them back: the saved theme and motion win over the buttons pressed in the HTML. Without saved settings, the page starts as before.

Psst, a JSON text goes in with `JSON.stringify` and comes out with `JSON.parse` :)
