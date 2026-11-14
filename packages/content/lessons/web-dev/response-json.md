A letter comes in an envelope. The envelope tells you it arrived and who sent it, but to read the letter you have to open it. A response from `fetch` is the envelope: its `status` says how it went. What it brings is inside, and opening it takes one more step.

## JSON, again

Open the practice API's address in a tab again and look at what it sends:

```text
[{"id":1,"name":"Aurora","class":"Cargo","status":"Docked","crew":4}, ...]
```

You know this from the settings page: it's **JSON**, data written as text. An array in square brackets, objects in curly ones. APIs almost always answer in JSON, because every language can read it.

## `response.json()`

`response.json()` reads the response's text and turns the JSON into real data, like `JSON.parse` does. Reading takes time too, since the text may still be arriving, so it returns a promise, and you `await` it:

```js
async function loadScores() {
  const response = await fetch("https://game.example/scores");
  const scores = await response.json();
  console.log(scores.length + " scores");
  console.log(scores[0]);
}
```

```text
3 scores
{player: "Mia", points: 120}
```

Two `await`s: one for the envelope, one for the letter inside. After that, `scores` is an ordinary array of objects, the kind you've used since the flight schedule: `scores.length`, `scores[0].player`, a `for...of` loop.

## Break it on purpose

Write `await response.text()` instead of `.json()`. `.text()` gives you the letter as one long text, not as data, and its `length` counts letters, not scores. Then leave out the second `await`: `scores` is a promise, and `scores.length` is `undefined`.

---

## Mission: How many?

The tracker knows the API answered. Now it should read what it said.

**Example**: open the tracker. Once the practice API answers, the line says:

```text
5 starships near the station
```

- `loadShips` reads the answer as JSON: a list of starships.
- It writes in `#tracker-status` how many starships the list has, then ` starships near the station`. With another list, the number follows it, 0 included.

Psst, there are two promises to wait for: the answer, then what's in it :)
