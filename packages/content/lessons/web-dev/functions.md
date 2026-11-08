You've written the same few lines more than once by now: find an element, write in it, log it. A **function** gives a piece of code a name, so you write it once and run it whenever you like.

## Making and calling one

```js
function openBay(bay) {
  console.log(`Opening ${bay}`);
  document.querySelector("#bay-status").textContent = `${bay} is open`;
}

openBay("Cargo Bay");
openBay("Fuel Bay");
```

- `function openBay(bay) { ... }` makes the function. Nothing runs yet.
- `bay` is a **parameter**: a name for a value the function gets each time it's called.
- `openBay("Cargo Bay")` **calls** it: the code inside runs, with `bay` holding `"Cargo Bay"`. The second call runs it again, with `"Fuel Bay"`.

A function can take several parameters, separated by commas, or none: `function closeAll() { ... }`.

## Why bother

- **Once, not everywhere.** Change how a message is shown, and you change one function, not ten copies.
- **A name says what it does.** `openBay("Cargo Bay")` reads like a sentence.
- **Smaller pieces.** A long script made of small named functions is easier to read and to fix.

## Functions you've already written

The `() => { ... }` you gave `addEventListener` is a function too, an **arrow function**, written shorter and with no name. A named function can be handed over the same way:

```js
button.addEventListener("click", () => {
  openBay("Cargo Bay");
});
```

---

## Mission: Intercom

- On `crew.html`, after the hours total, add two buttons, with the ids `call-dinner` and `call-bridge`, that say **Call to dinner** and **Call to the bridge**, and an empty paragraph with the id `intercom`.
- In `crew.js`, write a function that takes a message, writes it in the intercom paragraph and logs it after `Intercom: `.
- Clicking **Call to dinner** calls it with `Dinner is served in the galley`; clicking **Call to the bridge**, with `All crew to the bridge`.
