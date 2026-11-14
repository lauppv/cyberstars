In a shared flat, everything in the kitchen belongs to everyone. Put a cake in the fridge, and someone eats it, because how could they know it was yours? Your own room is different: what's in it stays yours unless you hand it out. Scripts on a page have been living in the shared kitchen.

## Every script shares everything

A page loads several scripts: `theme.js`, `menu.js`, `tracker.js`. Every name a script makes at its top level, a `const`, a `function`, is shared with all the others. If `menu.js` and `tracker.js` both had a `const list`, the second one would break with an error: `list` has already been declared.

As the site grows, that gets harder to avoid. And any script can call any function of another one, even by mistake.

## `type="module"`

A **module** is a script with a room of its own. Load it with `type="module"`:

```html
<script type="module" src="tracker.js"></script>
```

- Everything the module makes stays inside it. Another script can't see `loadShips`, and can have a `loadShips` of its own without a clash.
- A module waits for the page to be read, like `defer`, so `defer` isn't needed.
- Its code runs in a stricter mode: a few old mistakes, like using a variable you never declared, become errors you can see.

Nothing else changes: the module's own code runs as before.

```html preview
<p id="note">Waiting...</p>
<script type="module">
  const note = document.querySelector("#note");
  note.textContent = "A module wrote this";
</script>
<script>
  console.log(typeof note);
</script>
```

The page says "A module wrote this", and the console says `undefined`: the classic script can't see `note`.

## Break it on purpose

Write `type="modul"`, with a typo. The browser doesn't know that type, so it skips the script without a word: the page does nothing at all. Then load `tracker.js` as a module and call `loadShips()` from another script: `loadShips is not defined`, since it stays inside its module.

---

## Mission: A room of its own

The tracker's script is the biggest of the site. It should keep its names to itself.

**Example**: the tracker works exactly as before, and a test that looks for `loadShips` from another script finds nothing: the console shows `test: loadShips is inside tracker.js`.

- `tracker.html` loads `tracker.js` as a module.
- The tracker works as before: its cards, its lines, the crew panel.

Psst, a module waits for the page by itself :)
