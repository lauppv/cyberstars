Think of a necklace: you start with an empty string and thread one bead on at a time, until it's done. A loop can build a piece of text the same way: start with nothing, and add a piece in every lap.

## Start empty, add in each lap

```js
const games = ["chess", "cards", "darts"];
let list = "";
for (let i = 0; i < games.length; i++) {
  list = list + games[i] + "! ";
}
console.log(list);
```

```text
chess! cards! darts!
```

Step by step:

- `let list = ""`: an **empty string**, two quotes with nothing between. It's a `let`, because it will change;
- each lap, `list = list + games[i] + "! "`: take what `list` has so far, stick the next game and `"! "` on the end, and keep the result;
- after the loop, `list` holds the whole sentence.

Lap by lap, `list` grows: `"chess! "`, then `"chess! cards! "`, then `"chess! cards! darts! "`.

## Then put it on the page

Build first, write once:

```js
document.querySelector("#games").textContent = list;
```

Writing inside the loop would also work, but each lap would replace the text, so you'd only ever see the last game.

## Break it on purpose

Make the string inside the loop:

```js
for (let i = 0; i < games.length; i++) {
  let list = "";
  list = list + games[i] + "! ";
}
console.log(list);
```

An error: `list is not defined`. A `let` made inside the `{ }` only exists inside them, and it starts empty again every lap. The string you build must be made **before** the loop.

---

## Mission: Everyone on board

The crew directory shows the whole crew on one line, built from the crew list.

**Example**: `crew.html` shows, under the roster:

```text
Mara Vega. Tomas Okafor. Ines Lindqvist. Kenji Arano.
```

- Under the roster, a paragraph with the id `everyone`.
- The script writes in it every name of the crew list, in order, each followed by a full stop and a space.
- The names come from the list on the page.

Psst, start with an empty string, before the loop :)
