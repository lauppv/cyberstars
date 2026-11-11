You already know comments from HTML and CSS: notes for people, ignored by the browser. JavaScript has them too, in two shapes.

## `//` for one line

Everything after `//`, to the end of the line, is a comment:

```js
// Say hello when the page opens
console.log("Game club loaded");

console.log(12); // how many members there are
```

The console shows `Game club loaded` and `12`. The notes are skipped.

## `/* */` for several lines

For a longer note, start with `/*` and end with `*/`, like in CSS:

```js
/*
  Game club script.
  Written by Sam, March.
*/
console.log("Game club loaded");
```

## Turning a line off

Just like in HTML, a comment can switch a line off without deleting it. Put `//` in front of it:

```js
// alert("Welcome to the club!");
console.log("Game club loaded");
```

The message box no longer shows, but the line is still there, ready to come back: delete the `//` and it runs again. That's very handy while you try things out.

## Break it on purpose

Comment out the wrong line, or too much:

```js
/*
alert("Welcome to the club!");
console.log("Game club loaded");
```

Without the closing `*/`, everything after `/*` is a comment, to the end of the file, and nothing runs. Worse, the console may show a `SyntaxError`. Every `/*` needs its `*/`.

---

## Mission: No more boxes

The crew is tired of clicking OK every time the directory opens. Switch the message box off, but keep it in `crew.js`, in case you want it back.

**Example**: when `crew.html` opens, no message box shows. The console still shows `Crew directory loaded` and `4`, and the system check's lines.

- No message box opens any more.
- `crew.js` still logs `Crew directory loaded`.

Psst, `//` switches off one line :)
