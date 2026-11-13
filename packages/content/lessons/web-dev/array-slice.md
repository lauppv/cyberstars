At school, you photocopy pages 3 and 4 of a book for a friend. Your friend gets two pages, and the book still has all its pages. Nothing was torn out. An array can give you a copy of some of its items the same way.

You know `slice` on a text from the Boarding Form: a piece of the text, from one place to another. Arrays have `slice` too.

## `slice(start, end)`

`slice` gives a new array with the items from the index `start` up to the index `end`, **without** the item at `end`:

```js
const songs = ["Intro", "Sunny", "Rain", "Night", "Outro"];

console.log(songs.slice(1, 3));
```

```text
["Sunny", "Rain"]
```

Index 1 is Sunny, index 2 is Rain, and index 3, Night, is where it stops, so Night isn't in it. A good way to remember: `end - start` is how many items you get. Here 3 - 1 = 2 songs.

With only a start, `slice` goes to the end of the array:

```js
console.log(songs.slice(3));
```

```text
["Night", "Outro"]
```

## The array stays as it was

`slice` copies. It doesn't take anything away:

```js
const songs = ["Intro", "Sunny", "Rain", "Night", "Outro"];
const firstTwo = songs.slice(0, 2);

console.log(firstTwo);
console.log(songs.length);
```

```text
["Intro", "Sunny"]
5
```

`firstTwo` has two songs, and `songs` still has all five. That's useful: you can take several parts of one list, and the list is always whole for the next one.

## Looping over a part

A `slice` is an array, so a `for...of` goes through it like any other:

```js
for (const song of songs.slice(0, 2)) {
  console.log(`Now playing: ${song}`);
}
```

```text
Now playing: Intro
Now playing: Sunny
```

## Break it on purpose

Ask for the first two songs with `songs.slice(0, 1)`, thinking "from 0 to 1". You get only `["Intro"]`: the item at `end` is never in it. Then ask for `songs.slice(1, 2)`, thinking "the first two". You get `["Sunny"]`, the second song only. When a slice is one item short or starts one too late, check your two numbers: the start counts from 0, and the end is left out.

---

## Mission: Who leads the shift

The first two names on the duty list lead the shift. The dashboard should name them, and still count everyone on duty.

**Example**: under the commander's line, the dashboard says:

```text
Shift leads: Vega. Orion.
6 on duty today
```

- Under `#duty-check`, a paragraph with the id `shift-leads` and, under it, one with the id `duty-count`.
- `#shift-leads` says `Shift leads: `, then the first two names of the duty list, each followed by a full stop and a space. With only one name on duty, only that one.
- `#duty-count` says how many names the whole list has, then ` on duty today`.

Psst, the first two items are `slice(0, 2)`, and the array keeps all of them :)
