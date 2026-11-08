One value per name works for a few things. A crew of twelve, a week of readings, a cargo list: those need one name for many values. That's an **array**.

## Making one

```js
const bays = ["Cargo", "Fuel", "Seeds"];
```

Square brackets, values separated by commas. Each value has a place, its **index**, counted **from 0**:

```js
bays[0]; // "Cargo"
bays[2]; // "Seeds"
bays.length; // 3
bays[bays.length - 1]; // "Seeds", always the last one
```

The last index is one less than the length, since counting starts at 0. `bays[3]` doesn't exist: it's `undefined`.

## Changing it

```js
bays.push("Water"); // adds at the end: ["Cargo", "Fuel", "Seeds", "Water"]
bays.pop(); // takes the last one off, and gives it back
bays.includes("Fuel"); // true
bays.join(", "); // "Cargo, Fuel, Seeds", one string
```

A `const` array can still change inside: `const` only means the name always points to the same array.

## Arrays from the page

`querySelectorAll` finds **every** element a selector matches, not just the first:

```js
const items = document.querySelectorAll("#manifest li");
items.length; // how many there are
items[0].textContent; // the first one's text
```

What it gives back is a **NodeList**, a list of elements that works like an array for `length` and `[index]`. If none match, the list is simply empty, length 0.

---

## Mission: Roster Facts

- On `crew.html`, right after the crew list, add an empty paragraph with the id `roster`.
- In `crew.js`, find all the items of the crew list and write in the roster paragraph how many there are and the first and last names, like `4 crew members, from Mara Vega to Kenji Arano`. It follows the list whatever is in it.
- Make an array of the station's shifts, `Morning`, `Day` and `Night`, then add `Dawn` at its end. Log the shifts joined with `, `, then how many there are.
