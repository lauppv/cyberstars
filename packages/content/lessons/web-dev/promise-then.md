Back at the burger place: you have your ticket. What do you do when your number is called? You stand up and take your burger. You decided that before it was ready: "when it comes, I take it". With a promise, you write that decision down.

## `.then`

`.then` takes a function and gives it to the promise. When the promise holds its value, the function runs, with the value as its parameter:

```js
function cookLater(dish, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dish);
    }, ms);
  });
}

cookLater("pancakes", 2000).then((dish) => {
  console.log("Eating " + dish);
});

console.log("Laying the table");
```

```text
Laying the table
Eating pancakes
```

"Laying the table" shows at once. Two seconds later, the promise holds "pancakes", and the function given to `.then` runs with it. You never wait yourself: you say what happens next, and go on.

## On the page

The function can change the page, like any other:

```html preview
<p id="order">Cooking...</p>
<script>
  const cookLater = (dish, ms) =>
    new Promise((resolve) => setTimeout(() => resolve(dish), ms));

  cookLater("Pancakes are ready!", 2000).then((text) => {
    document.querySelector("#order").textContent = text;
  });
</script>
```

The page says "Cooking...", and two seconds later "Pancakes are ready!". Change the code a little and watch it again.

## Break it on purpose

Write the value straight into the page, without `.then`:

```js
const order = cookLater("Pancakes are ready!", 2000);
document.querySelector("#order").textContent = order;
```

The page says `[object Promise]`. `order` is the ticket, not the pancakes: the value isn't there yet. Only `.then` gets the value, once it's there.

Then give `.then` a call instead of a function: `.then(show("Pancakes"))`. The text shows at once, as with `setTimeout`: `show(...)` runs right there. Hand over the function.

---

## Mission: Found!

The tracker's line says it is loading. Use your slow tracker, `answerLater`, to change it once the answer comes.

**Example**: open the tracker. The line says `Loading the starships...` with its spinner, and one second later:

```text
Starships found
```

- When the page opens, `tracker.js` asks `answerLater` for the text `Starships found`, in one second.
- When the promise holds it, its text becomes the whole text of `#tracker-status`, spinner and all. Before that, the line still says it is loading.

Psst, `textContent` takes the promise's value, not the promise :)
