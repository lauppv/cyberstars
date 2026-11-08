The function you wrote does something: it writes and logs. Many other functions **work something out** instead, and give the answer back to whoever called them.

## return

```js
function crateWeight(count, eachKg) {
  return count * eachKg;
}

const total = crateWeight(40, 12);
console.log(total); // 480
```

`return` ends the function and gives its value back. Then the call, `crateWeight(40, 12)`, stands for that value: you can keep it in a variable, log it, put it in a template literal, or give it to another function.

A function that never reaches a `return` gives back `undefined`. And nothing after a `return` ever runs:

```js
function check(pressure) {
  return pressure * 2;
  console.log("never shown");
}
```

## Doing versus working out

- A function that **does** something, like your intercom, changes the page or logs.
- A function that **works something out** takes values and returns a new one, without touching the page.

The second kind is the easiest to reuse and to trust: the same values in, the same answer out, every time, wherever you call it. Do the working out first, and write on the page at the end.

```js
function bayLabel(name, crates) {
  return `${name}: ${crates} crates`;
}

document.querySelector("#bay-a").textContent = bayLabel("Bay A", 40);
document.querySelector("#bay-b").textContent = bayLabel("Bay B", 12);
```

---

## Mission: Time Format

Your oxygen check turns hours into days and hours. The crew's working hours need the same, and the same words.

- On `crew.html`, after the hours total, add an empty paragraph with the id `watch-time`. It says how long the crew worked this week in days and hours: `Total watch time: 5 days and 22 hours` for 142 hours.
- The oxygen paragraph keeps saying `Oxygen for 16 days and 6 hours`.
- Turning hours into days and hours should be written once in your script, and used for both. Both follow the numbers on the page.
