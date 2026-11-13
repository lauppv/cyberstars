When you unpack a school bag, you take out each thing and put it where you'll use it: the pencil case on the desk, the book next to it. You don't keep reaching into the bag for every single pencil. JavaScript can unpack an object the same way.

## Reaching in again and again

The tracker's cards read every value through the object: `ship.name`, `ship.status`, `ship.crew`. Each time, `ship.` again. With more values, that's a lot of `ship.`, and long lines.

## Destructuring an object

**Destructuring** takes values out of an object into variables of the same name, in one line:

```js
const pupil = { name: "Mia", age: 13, town: "Cluj" };
const { name, age } = pupil;

console.log(name);
console.log(age);
```

```text
Mia
13
```

The curly brackets on the left aren't an object: they say "take these keys out of `pupil`". `name` gets `pupil.name`, `age` gets `pupil.age`. `town` stays in the object, since you didn't ask for it. The order inside the brackets doesn't matter, only the names: they must be the object's keys.

## Break it on purpose

Ask for a key the object doesn't have: `const { name, city } = pupil;`. No error: `city` is simply `undefined`, as `pupil.city` would be. A typo in a key gives you an `undefined` somewhere on the page, so read the keys carefully. Then try `const { class } = ship;` with the starships' `class` key. The browser refuses the whole script: `class` is a word JavaScript keeps for itself. You'll see how to get it in a later lesson.

---

## Mission: People on board

The practice API also says how many people are on each starship, as `crew`. The cards should show it.

**Example**: under each card's status, a line like `Crew: 4`. Aurora says `Crew: 4`, Comet Runner `Crew: 6`, and so on.

- The template's card gets one more line, with the class `ship-crew`, after the status.
- `showShip` takes the starship's `name`, `status` and `crew` out of it with destructuring, and writes `Crew: ` and the crew's number in `.ship-crew`.
- The name, the class and the status still show as before.

Psst, the names in the curly brackets are the object's keys, so they're spelled exactly like them :)
