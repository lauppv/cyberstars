A teacher with a printed class list types it into a spreadsheet, one row per pupil, so the computer can sort and count it. Your flight table is on the page, but for a script it's just cells of text. Turning its rows into objects makes it data the script can really work with.

## One object per row

```js
const players = [];
for (const row of document.querySelectorAll("#scores tbody tr")) {
  players.push({
    name: row.querySelector(".name").textContent,
    points: Number(row.querySelector(".points").textContent),
  });
}
console.log(players);
```

```text
[{name: "Sam", points: 12}, {name: "Lea", points: 9}]
```

Step by step:

- start with an empty array, `[]`;
- for each row of the table's body, make an object;
- `row.querySelector(".name")` looks for `.name` **inside that row only**: `querySelector` works on any element, not just on `document`;
- `push` the object onto the array.

After the loop, `players` holds one object per row, with real numbers where the page has numbers.

## Why bother?

Once the data is in objects, the rest of the script never has to dig in the HTML again: `players[0].points`, `players.length`, a loop over `players`. In the next lessons, you'll filter and sort this kind of list.

## Break it on purpose

Look for the cell in the whole document instead of the row:

```js
name: document.querySelector(".name").textContent,
```

Every object gets the **first** row's name: `document.querySelector` always finds the first `.name` on the page. Inside a loop over rows, ask the row.

---

## Mission: The board as data

The schedule's script reads the flight table into a list of objects, one per flight.

**Example**: when `schedule.html` opens, the console shows:

```text
Flights read: 5
Last on the board: SL-105 to Orbital Yard
```

- In `schedule.js`, an array named `flights` holds an object per row of the flight table's body, with its `code`, `destination`, `departs` and `status`, read from that row's cells.
- The console shows `Flights read: ` and how many objects the array has.
- It shows `Last on the board: `, then the last object's code, `to` and its destination.

Psst, ask the row, not the document, for its cells :)
