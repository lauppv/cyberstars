At a race, the first one over the line gets gold, the second silver. You don't need the whole list of runners to hand out the medals: only the first two names. Taking the first items of a list is something you do all the time.

## Destructuring an array

Objects have keys, arrays have places. So array destructuring uses square brackets, and takes the items by their place, from the first:

```js
const runners = ["Ana", "Ben", "Cara", "Dan"];
const [gold, silver] = runners;

console.log(gold);
console.log(silver);
```

```text
Ana
Ben
```

`gold` gets the first item, `silver` the second. The names are yours: here they say what the places mean, which `runners[0]` and `runners[1]` don't. The rest of the array stays where it is.

The items can be objects too. Then each variable holds an object, and you read its values with a dot:

```js
const [first] = scores;
console.log(first.player);
```

## Break it on purpose

Swap the names: `const [silver, gold] = runners;`. No error, and Ben gets gold. The place decides, not the name. Then write the variable straight into a text: `` `Winner: ${first}` `` with `first` an object. The page says `Winner: [object Object]`: an object written as a text says only what it is. Write `first.player`.

---

## Mission: Closest first

The practice API lists the starships closest to the station first. The tracker should name the two closest.

**Example**: under the crew's line, a new line:

```text
Closest starships: Aurora and Comet Runner
```

- Between `#crew-on-board` and the list `ships`, a paragraph with the id `closest`.
- Once the starships are in, `loadShips` takes the first two out of the list with destructuring, and writes in `#closest` `Closest starships: `, the first one's name, the word `and` with a space on each side, then the second one's name.
- After an error, `#closest` stays empty.

Psst, the variables hold whole starships, so their names are a dot away :)
