At a cloakroom, each coat hangs with its ticket. When the evening ends, the attendant goes along the rail, and for each hook reads two things together: the ticket number and the coat on it. Not all the numbers first, then all the coats: a pair at a time. `Object.entries` gives you an object's keys and values in pairs.

## `Object.entries`: pairs

`Object.entries` gives back an array with one item for each key. Each item is itself a small array of two: the key, then its value:

```js
const pets = { cat: "Tom", dog: "Rex", fish: "Bubbles" };

console.log(Object.entries(pets));
```

```text
[["cat", "Tom"], ["dog", "Rex"], ["fish", "Bubbles"]]
```

An item like `["cat", "Tom"]` is called an **entry**: a key and its value, side by side.

## Reading an entry

An entry is an array, so you read its two parts by index: `[0]` is the key, `[1]` is the value. In a `for...of`, each time round you get the next entry:

```js
for (const entry of Object.entries(pets)) {
  console.log(`The ${entry[0]} is called ${entry[1]}`);
}
```

```text
The cat is called Tom
The dog is called Rex
The fish is called Bubbles
```

That's the same as `for...in` with `pets[key]`, but here the key and the value come together, ready to use.

## From entries to the page

With the pairs, a loop can build a line of the page for each key:

```html preview
<ul id="pet-list"></ul>
<script>
  const pets = { cat: "Tom", dog: "Rex", fish: "Bubbles" };
  for (const entry of Object.entries(pets)) {
    const item = document.createElement("li");
    item.textContent = `${entry[0]}: ${entry[1]}`;
    document.querySelector("#pet-list").append(item);
  }
</script>
```

The page shows a list: cat: Tom, dog: Rex, fish: Bubbles. Add `bird: "Kiwi"` to the object, and a fourth line appears.

## Break it on purpose

Put the whole entry into the text: `` item.textContent = `${entry}` ``. The list says `cat,Tom`: the entry is an array, and an array in a text becomes its items with a comma between them. Then count from 1, with `entry[1]` and `entry[2]`: you get `Tom: undefined`, since an entry has only the indexes 0 and 1.

---

## Mission: A summary for the radio

The crew reads the dashboard's numbers over the radio every morning, a line for each card.

**Example**: under the line of values, a list:

```text
- Crew on board: 6
- Oxygen: 98%
- Water: 1,240 litres
- Next launch: Friday
- Power: 87%
- Days in orbit: 412
```

- After `#stat-values` and before the week, a list with the id `stat-summary`, empty in the HTML.
- The script adds one list item for each key of the object of the cards, in the object's order, with the key, `: `, and its value.

Psst, `entry[0]` is the key and `entry[1]` its value :)
