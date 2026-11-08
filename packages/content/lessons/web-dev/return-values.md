The function you wrote does something: it writes and logs. Many functions instead **work something out** and hand the answer back to whoever called them.

## return

```js
function crateWeight(count, eachKg) {
  return count * eachKg;
}

const total = crateWeight(40, 12);
console.log(total); // 480
```

`return` ends the function and gives its value back. The call, `crateWeight(40, 12)`, then stands for that value: you can keep it in a variable, log it, put it in a template literal, or pass it to another function.

A function that never reaches a `return` gives back `undefined`. And nothing after a `return` runs:

```js
function check(pressure) {
  return pressure * 2;
  console.log("never shown");
}
```

## Doing versus working out

- A function that **does** something, like your intercom, changes the page or logs.
- A function that **works something out** takes values and returns a new one, without touching the page.

The second kind is the easiest to reuse and to trust: the same values in, the same answer out, every time, wherever it's called. Keep the work out of the page, and do the writing at the end.

```js
function bayLabel(name, crates) {
  return `${name}: ${crates} crates`;
}

document.querySelector("#bay-a").textContent = bayLabel("Bay A", 40);
document.querySelector("#bay-b").textContent = bayLabel("Bay B", 12);
```

---

## Mission: Time Format

Your oxygen check turns hours into days and hours. The crew's hours need the same.

- In `crew.js`, write a function that takes a number of hours and returns them as whole days and hours left, like `16 days and 6 hours`.
- Use it for the oxygen paragraph, which keeps saying `Oxygen for 16 days and 6 hours`.
- On `crew.html`, after the hours total, add an empty paragraph with the id `watch-time`. Use the same function to write in it the week's total hours of the crew: `Total watch time: 5 days and 22 hours` for 142 hours.
