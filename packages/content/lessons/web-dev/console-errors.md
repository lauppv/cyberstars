When a game crashes, it sometimes shows a message: "Error 404" or "Out of memory". Annoying, but useful: it tells whoever fixes it where to look. JavaScript does the same. When a line goes wrong, it writes an **error** in the console, in red.

## Reading an error

Say a script has this line:

```js
consol.log("Members: 12");
```

The console shows something like:

```text
ReferenceError: consol is not defined   games.js:1
```

Three things to read:

- **the kind** of error: `ReferenceError` means "I don't know this name". `consol` isn't a word JavaScript knows;
- **the message**: `consol is not defined`, the word it tripped on;
- **where**: `games.js:1` means the file `games.js`, line 1.

So you go to line 1 of `games.js`, look for `consol`, and fix it to `console`.

## The script stops there

When a line has an error, the script **stops** at that line. Every line after it doesn't run at all. So one mistake near the top can make a whole script seem dead. Fix the first error first, then look again: often the next one shows up.

## Two kinds you'll see a lot

- `ReferenceError: ... is not defined`: a misspelled name, or a capital letter that shouldn't be there. Check the spelling.
- `SyntaxError`: the browser can't even read the line, often a missing quote or bracket. With a `SyntaxError`, **no** line of the file runs, not even the ones above it.

## Break it on purpose

Write a line with a missing closing quote:

```js
console.log("Members: 12);
```

The console shows a `SyntaxError`, and nothing from that file is logged. Add the quote back, and everything runs again.

---

## Mission: The system check

Your site has a new file, `check.js`, the station's system check. Someone wrote it in a hurry, and it has three mistakes.

**Example**: once `check.js` is fixed, the console shows its lines, ending with:

```text
All systems go
```

- `crew.html` loads `check.js` too, with its own `<script>` tag before the one for `crew.js`.
- The console shows `All systems go`.
- The console shows no errors.

Psst, fix the first red line, then look again: the next one may only show up then :)
