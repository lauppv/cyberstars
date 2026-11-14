A birthday invitation says: "Bring whoever you like". One guest comes alone, another with three friends. The host doesn't need to know the number in advance: they just open the door to everyone who comes. Some functions are like that host.

## Any number of values

`console.log` takes one value, two, ten: `console.log("a", "b", "c")`. Your own functions so far take a fixed number of parameters. To take any number, write three dots in front of the **last** parameter:

```js
function greetAll(...names) {
  console.log(names);
}

greetAll("Mia", "Ben", "Ana");
greetAll("Dan");
greetAll();
```

```text
[Mia, Ben, Ana]
[Dan]
[]
```

`...names` is a **rest parameter**: it collects all the rest of the values into an array. Nothing given? It's an empty array, never `undefined`. Other parameters can come before it: `function invite(host, ...guests)`.

## Spread or rest?

The same three dots, two jobs:

- In a **call**, they spread an array into separate values: `greetAll(...pupils)`.
- In a **parameter**, they collect separate values into an array: `function greetAll(...names)`.

So when your names are already in an array, spread it into the call:

```js
const pupils = ["Mia", "Ben"];
greetAll(...pupils);
```

## Break it on purpose

Call `greetAll(pupils)` without the dots. `names` is an array with one item, which is itself the whole array: `[[Mia, Ben]]`. Then write the function as `function greetAll(names)` without dots, and call `greetAll("Mia", "Ben")`: `names` is only "Mia", and "Ben" is lost.

---

## Mission: Docked now

The crew wants one line that names every starship docked at the station right now.

**Example**: under the closest starships, a line:

```text
Docked now: Aurora, Silver Gull
```

When no starship is docked, it says `Docked now: none`.

- In `tracker.js`, a function `listNames` takes any number of names, and returns them joined with `, `, or `none` when it got no name at all.
- Between `#closest` and the list `ships`, a paragraph with the id `docked-now`. Once the starships are in, `loadShips` writes in it `Docked now: ` and what `listNames` gives for the names of the docked starships, spread into the call.

Psst, the dots in the parameter collect, the dots in the call spread :)
