One value per name works for a few things. But a crew of twelve, a week of readings or a cargo list needs one name for many values. That's an **array**.

## Making one

```js
const bays = ["Cargo", "Fuel", "Seeds"];
```

Square brackets, with commas between the values. Each value has a place, called its **index**, counted **from 0**:

```js
bays[0]; // "Cargo"
bays[2]; // "Seeds"
bays.length; // 3
bays[bays.length - 1]; // "Seeds", always the last one
```

The last index is one less than the length, because counting starts at 0. `bays[3]` doesn't exist: it's `undefined`.

## Changing it

```js
bays.push("Water"); // adds at the end: ["Cargo", "Fuel", "Seeds", "Water"]
bays.pop(); // takes the last one off, and gives it back
bays.includes("Fuel"); // true
bays.join(", "); // "Cargo, Fuel, Seeds", one string
```

A `const` array can still change inside. `const` only means the name always points to the same array.

## Arrays from the page

`querySelectorAll` finds **every** element a selector matches, not just the first:

```js
const items = document.querySelectorAll("#manifest li");
items.length; // how many there are
items[0].textContent; // the first one's text
```

It gives back a **NodeList**: a list of elements that works like an array for `length` and `[index]`. If nothing matches, the list is just empty, with a length of 0.

---

## Mission: Roster Facts

- On `crew.html`, right after the crew list, add an empty paragraph with the id `roster`.
- The roster sums up the crew list: how many people it holds, and the first and last names on it, like `4 crew members, from Mara Vega to Kenji Arano`. Whatever the list holds, the roster follows it.
- The station's shifts are `Morning`, `Day` and `Night`, and a new one, `Dawn`, joins at the end. Keep the shifts in your script, add the new one, then show the console the shifts and how many there are:

```text
Morning, Day, Night, Dawn
4
```
