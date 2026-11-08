One object is one flight. A whole schedule is an **array of objects**: the most common shape of data on the web. A list of products, of messages, of users: each an object, all in an array.

## Building one

```js
const crates = [
  { name: "Water", weight: 120 },
  { name: "Seeds", weight: 45 },
];

crates[1].name; // "Seeds"
crates.length; // 2
```

`crates[1]` is an object, so `.name` reads its property. Loops work as with any array:

```js
for (const crate of crates) {
  console.log(`${crate.name}: ${crate.weight} kg`);
}
```

## From the page

When the data is on the page, a function can read it into an array of objects once, and the rest of the script works with the objects instead of digging through cells each time:

```js
function readCrates() {
  const crates = [];
  for (const row of document.querySelectorAll("#manifest tr")) {
    crates.push({
      name: row.querySelector(".name").textContent,
      weight: Number(row.querySelector(".weight").textContent),
    });
  }
  return crates;
}
```

Turn numbers into numbers as you read them, and every later step can count on it.

---

## Mission: Destinations

- Write a function that reads every flight of the table's body into an array of objects, with `code`, `destination`, `departs` and `status`, and returns it. Keep the array in a constant.
- Log how many flights it read: `5 flights read`.
- Under the next flight, add an empty paragraph with the id `destinations`, and write in it every destination, in the table's order, joined with `, `: `Destinations: Moon Base, Mars Relay, ...`.
