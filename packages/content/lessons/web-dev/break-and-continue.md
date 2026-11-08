Sometimes a loop doesn't need to finish, or needs to skip a round. Two words let you do that.

## break

`break` ends the loop at once, wherever it is:

```js
const weights = [40, 130, 85, 210, 0, 60];
let firstHeavy = "none";
for (const weight of weights) {
  if (weight > 100) {
    firstHeavy = weight;
    break;
  }
}
console.log(firstHeavy); // 130
```

Once the first heavy crate is found, there's no point looking any further. Without `break`, the loop would go on, and `firstHeavy` would end up as the **last** heavy crate, 210.

## continue

`continue` ends **this round** and goes on with the next:

```js
let count = 0;
for (const weight of weights) {
  if (weight === 0) {
    continue;
  }
  count++;
}
console.log(count); // 5
```

Empty crates, weighing 0, are skipped: everything after `continue` in the block doesn't run for them.

Both work in `for`, `for...of` and `while` loops. Use them when they make the loop clearer: "stop here", "skip this one". When a plain `if` around the code reads just as well, use the `if`.

---

## Mission: Board Scan

Two quick answers for the control room. Under the fuel gauge, add empty paragraphs with the ids `first-delay` and `active-count`.

- The first one names the first delayed flight in the table: `First delay: SL-103`. When no flight is delayed, `First delay: none`. There's no need to look past the first one.
- The second counts the flights that aren't cancelled: `Active flights: 4`.

Both follow whatever the table holds.
