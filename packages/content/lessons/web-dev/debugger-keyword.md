A bookmark sits in a book, at the page you want to come back to. Next time you open the book, it opens right there. You don't have to search for the page again. Code can carry a bookmark of its own, for the debugger.

## `debugger`

Clicking a line number in Sources needs the file found in the list first, and the mark can get lost when the preview draws the page again. Instead, you can write the breakpoint into the code:

```js
for (const pupil of pupils) {
  debugger;
  marks[pupil.name] = pupil.mark;
}
```

When DevTools is open, the code stops on `debugger`, as on a breakpoint: the Scope part, stepping and Resume work the same. When DevTools is closed, the line does nothing at all.

It's handy where a breakpoint is hard to place: inside a function that's called from many places, or in a file the page loads a moment later.

## Take it out again

A `debugger` line is for you, not for the visitors of your site. Once the bug is found, remove it: a visitor who opens DevTools for any reason would land in your code, stopped. Search your files for `debugger` before you're done.

## Break it on purpose

Write `debugger` and close DevTools: nothing stops, since the line only works while DevTools is open. Then leave a `debugger` inside a loop that runs a hundred times, and open DevTools: you press Resume a hundred times. Put it before the loop, or behind an `if` that's true only for the turn you want, like `if (pupil.name === "Mia") { debugger; }`.

---

## Mission: Status count

The lesson brings a file, `status-count.js`, whose function counts how many starships have each status. Every count comes out 0. Put a `debugger` in it to find out why.

**Example**: under the average, a line:

```text
Docked: 2, On the way: 1, Boarding: 1, Leaving: 1
```

- Between `#average-crew` and the list `ships`, a paragraph with the id `status-counts`. Once the starships are in, it lists each status and its count from the function of `status-count.js`, in the order it gives them: the status, a colon and a space, the count, and a comma and a space between two.
- `status-count.js` counts every starship. Find the bug with `debugger`, and fix it in that file.
- No `debugger` is left in your files once you're done.

Psst, a calculation whose answer isn't stored anywhere changes nothing :)
