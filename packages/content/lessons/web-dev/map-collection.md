At a school vote for the class trip, the teacher writes each place on the board the first time someone says it, and adds a tick each time it comes up again: "zoo: 3, museum: 1, beach: 5". A list of names, each with its count, in the order they came. JavaScript has a collection made for pairs like that: a `Map`.

## `new Map()`

A **Map** holds pairs: a key and its value, like an object. You make an empty one with `new Map()`, then add pairs with `set`, and read them with `get`:

```js
const votes = new Map();

votes.set("zoo", 1);
votes.set("beach", 2);
console.log(votes.get("beach"));
console.log(votes.get("museum"));
```

```text
2
undefined
```

`get` gives `undefined` for a key the map doesn't have. `set` on a key that's already there replaces its value.

## What a Map knows

- `has(key)` answers `true` or `false`: is this key in the map?
- `size` is how many pairs it holds: `votes.size` is 2.
- `delete(key)` removes one pair.

## Counting with a Map

A count that starts at 0 for a key never seen fits well with `??`:

```js
const votes = new Map();
for (const place of ["zoo", "beach", "zoo", "zoo"]) {
  votes.set(place, (votes.get(place) ?? 0) + 1);
}
console.log(votes.get("zoo"));
```

```text
3
```

The first "zoo" has no count yet, so `get` gives `undefined`, `??` turns it into 0, and the map gets 1.

## Going through it

A `for...of` goes through a map's pairs, in the order they were first added. Each pair is an array of two, like an entry of `Object.entries`:

```js
for (const entry of votes) {
  console.log(`${entry[0]}: ${entry[1]}`);
}
```

```text
zoo: 3
beach: 1
```

## Map or object?

An object works for pairs too, but a Map is made for them: it knows its `size`, keeps the order you added the keys in, and its keys can be anything, a number or even an element of the page, not only texts. Use a Map for a collection that grows while the page runs, and an object for a thing with fixed properties, like a player with a name and a score.

## Break it on purpose

Use square brackets on a map: `votes["zoo"] = 1`. No error, but it's not a pair of the map: it's a property stuck on the map object. `votes.get("zoo")` gives `undefined`, and `for...of` doesn't see it. With a Map, use `set` and `get`.

---

## Mission: What visitors pick

The crew wonders which themes people try before they decide. During one visit, the settings page should count each theme that is chosen.

**Example**: open the page, click Light, Dark, then Light again. Under the reset button, the page says:

```text
Picked: light 2, dark 1
```

- Under `#reset-settings`, a paragraph with the id `picks`, which says `Picked: nothing yet` when the page opens.
- The `settings` object counts, in a Map, how many times each theme is chosen during the visit, by its button or by bringing settings.
- After each choice, `#picks` says `Picked: `, then each theme chosen so far with its count, in the order they were first chosen, with a comma and a space between two.

Psst, a theme chosen for the first time has no count yet: `??` gives it 0 :)
