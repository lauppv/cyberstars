You want to sort your class photos by who's tallest, but the album is in the order they were taken, and you like it that way. So you make copies of the photos and sort the copies. The album stays as it was.

## `sort` changes the array itself

You know `sort` from the flight schedule. What you may not have noticed: it doesn't make a new array. It **moves the items of the same array**, and everything that uses it sees the new order.

```js
const pupils = ["Mia", "Ben", "Ana"];
const sorted = pupils.sort();

console.log(sorted);
console.log(pupils);
```

```text
[Ana, Ben, Mia]
[Ana, Ben, Mia]
```

Both are sorted: `sorted` and `pupils` are the same array.

## `...`: spreading an array

Three dots in front of an array, inside square brackets, **spread** its items into a new array:

```js
const copy = [...pupils];
```

`copy` is a new array with the same items. Sort it, and `pupils` keeps its order:

```js
const sorted = [...pupils].sort();
```

Spread can also join arrays, or add items around them:

```js
const morning = ["Mia", "Ben"];
const afternoon = ["Ana"];
const everyone = [...morning, ...afternoon, "Dan"];
```

`everyone` is `[Mia, Ben, Ana, Dan]`, and `morning` and `afternoon` haven't changed.

## Break it on purpose

Take the dots away: `const sorted = pupils.sort();`. The list you meant to sort is sorted, and so is the original, so whatever showed the original order now shows the sorted one. Then write `[pupils]` without the dots: you get an array with one item, the whole array, and sorting it does nothing.

---

## Mission: Biggest crews

Under the starship cards, the crew wants the three starships with the most people on board, biggest first. The cards themselves should stay in the API's order, closest first.

**Example**: under the list `ships`, a heading such as "Biggest crews", then a numbered list:

```text
1. Silver Gull, 7 crew
2. Comet Runner, 6 crew
3. Red Horizon, 5 crew
```

The cards still go Aurora, Comet Runner, Lunar Ferry, Red Horizon, Silver Gull.

- After the list `ships`, a numbered list with the id `biggest-crews`.
- `loadShips` sorts a copy of the starships by crew, biggest first, and lists the first three in `#biggest-crews`, each as the name, `, `, the crew, then ` crew`.
- The cards keep the API's order.

Psst, `sort` moves the items of the array you call it on :)
