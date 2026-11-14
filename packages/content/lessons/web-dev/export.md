In a school, each class has a room. Most of what's in it stays there. But the school's library lends books to any class that asks. It doesn't lend everything, only what it puts on the lending shelf. A module can have a lending shelf too.

## `export`

Inside a module, everything stays inside. `export` in front of a `const`, a `function` or a `class` puts it on the shelf, so other modules can use it:

```js
export const SCHOOL = "Hill Street School";

export function greet(name) {
  return `Welcome to ${SCHOOL}, ${name}!`;
}

function secret() {
  return "only for this file";
}
```

`SCHOOL` and `greet` are **exported**: other files can take them. `secret` isn't: it stays a helper of this file. A file can export as many things as it likes, each by its name.

You can also list them at the end, all at once:

```js
export { SCHOOL, greet };
```

## Why split code into files

The tracker loads data in three places: the starships, the crew count, the crew panel. Each time, the same steps: `fetch`, check `ok`, throw, read JSON. A file of its own for talking to the API means those steps are written once, and every page that needs the API can use them. The tracker's file gets shorter, and easier to read.

## Break it on purpose

Leave out `export` in front of `greet`. Nothing breaks in this file, and another file that asks for `greet` gets nothing. Then export the same name twice. The browser refuses the file: a name can be on the shelf only once.

---

## Mission: The API's own file

Talking to the practice API should live in a file of its own, ready for every page.

**Example**: a new file, `api.js`, exports the two addresses and a function. `getJson(CREW_URL)` gives a promise of the crew list. The tests take your file themselves, and write in the console what they find, like `test: api.js shares CREW_URL, SHIPS_URL, getJson`.

- `api.js` exports `SHIPS_URL` and `CREW_URL`, the practice API's starships and crew addresses.
- It exports an `async` function `getJson(url)` that asks the address with `fetch`, throws a new error with the message `The tracker answered ` and the status when the answer isn't ok, and returns what the answer holds, read as JSON.
- The tracker works as before. Nothing uses `api.js` yet: that's the next lesson.

Psst, `getJson` gives the data, not the response :)
