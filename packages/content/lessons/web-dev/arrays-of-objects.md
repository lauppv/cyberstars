One object is one flight. A whole schedule is an **array of objects**: the most common shape of data on the web. A list of products, of messages, of users: each one an object, all of them in an array.

## Building one

```js
const crates = [
  { name: "Water", weight: 120 },
  { name: "Seeds", weight: 45 },
];

crates[1].name; // "Seeds"
crates.length; // 2
```

`crates[1]` is an object, so `.name` reads its property. Loops work like with any array:

```js
for (const crate of crates) {
  console.log(`${crate.name}: ${crate.weight} kg`);
}
```

## From the page

When the data is on the page, a function can read it into an array of objects once. Then the rest of the script works with the objects, instead of digging through the cells every time:

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

Turn numbers into real numbers as you read them, and every later step can rely on it.

---

## Mission: Destinations

The next lessons ask many questions about the flights. Read the table once, so every question can work with the flights instead of with cells.

- Your script reads every flight of the table's body, with its `code`, `destination`, `departs` and `status`, and keeps them all. The console says how many it read: `5 flights read`.
- Under the next flight, add an empty paragraph with the id `destinations`. It lists every destination, in the table's order, with `, ` between them: `Destinations: Moon Base, Mars Relay, ...`.
