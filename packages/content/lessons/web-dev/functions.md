By now you've written the same few lines more than once: find an element, write in it, log it. A **function** gives a piece of code a name, so you write it once and run it whenever you want.

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
- `bay` is a **parameter**: a name for a value the function gets each time it's used.
- `openBay("Cargo Bay")` **calls** it: the code inside runs, with `bay` holding `"Cargo Bay"`. The second call runs it again, with `"Fuel Bay"`.

A function can take several parameters, with commas between them, or none at all: `function closeAll() { ... }`.

## Why bother

- **Once, not everywhere.** To change how a message is shown, you change one function, not ten copies.
- **A name says what it does.** `openBay("Cargo Bay")` reads like a sentence.
- **Smaller pieces.** A long script made of small named functions is easier to read and to fix.

## Functions you've already written

The `() => { ... }` you gave `addEventListener` is a function too. It's called an **arrow function**: shorter, and without a name. You can call a named function from inside it:

```js
button.addEventListener("click", () => {
  openBay("Cargo Bay");
});
```

---

## Mission: Intercom

The crew page gets an intercom: buttons that send a message to the whole station.

- On `crew.html`, after the hours total, add two buttons, with the ids `call-dinner` and `call-bridge`, that say **Call to dinner** and **Call to the bridge**, and an empty paragraph with the id `intercom`.
- **Call to dinner** sends `Dinner is served in the galley`, and **Call to the bridge** sends `All crew to the bridge`. Sending a message shows it in the intercom paragraph, and logs it after `Intercom: `, like `Intercom: All crew to the bridge`.
- Both buttons send their message the same way, so write how a message is sent only once.
