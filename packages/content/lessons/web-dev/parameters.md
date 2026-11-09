A coffee machine has one "make coffee" button... but you choose small or large first. The steps are the same, only one detail changes. A function can take details like that too: they're called **parameters**.

## A function that takes something

```js
function showNote(message) {
  document.querySelector("#note").textContent = message;
}
```

`message` in the brackets is a **parameter**: a name for a value the function will be given when it's called. Inside the function, `message` works like a variable.

When you call it, you put the value in the brackets:

```js
showNote("The club is open today");
showNote("Bring your own board");
```

The first call writes "The club is open today", the second replaces it with "Bring your own board". One function, any message.

## Several parameters

Separate them with commas, in the same order when you call:

```js
function showScore(name, points) {
  console.log(`${name}: ${points} points`);
}
showScore("Sam", 12);
showScore("Lea", 9);
```

```text
Sam: 12 points
Lea: 9 points
```

## On a click

A button's click calls the function with nothing in its brackets. To pass a detail, call yours from inside a small arrow function:

```js
document.querySelector("#open").addEventListener("click", () => {
  showNote("The club is open today");
});
```

## Break it on purpose

Forget to pass the value:

```js
showNote();
```

The note says `undefined`. The function got no message, so `message` holds "nothing". A parameter only has a value when the call gives it one.

---

## Mission: The intercom

The intercom gets two more buttons, and they share one function.

**Example**: under the alarm, two buttons: `Call to dinner` and `Call to the bridge`. A click on the first makes the intercom say `Dinner is ready`, a click on the second `Report to the bridge`.

- Buttons with the ids `call-dinner` and `call-bridge`.
- A click on `call-dinner` writes `Dinner is ready` in `#intercom`, and a click on `call-bridge` writes `Report to the bridge`.
- Before any click, the intercom stays empty.
- Both go through one function, which takes the message as a parameter and writes it.

Psst, the message is a parameter: one function, any message :)
