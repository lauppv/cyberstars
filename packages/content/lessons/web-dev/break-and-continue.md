Sometimes a loop doesn't need to finish, or needs to skip a round. Two words control that.

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

Once the first heavy crate is found, there's no point looking further. Without `break`, the loop would go on, and `firstHeavy` would end up as the **last** heavy crate, 210.

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

Empty crates, weighing 0, are skipped; everything after `continue` in the block doesn't run for them.

Both work in `for`, `for...of` and `while` loops. Use them when they make the loop clearer: "stop here", "skip this one". When a plain `if` around the code reads just as well, prefer the `if`.

---

## Mission: Board Scan

- Under the fuel gauge, add empty paragraphs with the ids `first-delay` and `active-count`.
- Loop over the flights and stop at the first delayed one: `First delay: SL-103`. With no delayed flight, `First delay: none`.
- In another loop, skip the cancelled flights and count the rest: `Active flights: 4`.
