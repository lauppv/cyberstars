You put a pizza in the oven and set a timer for 12 minutes. Then you go and do something else. When the timer rings, you take the pizza out. You didn't stand and stare at the oven: the timer told you when. JavaScript has timers too.

## `setTimeout`

`setTimeout` runs a function once, later. It takes the function, and how long to wait, in milliseconds:

```js
console.log("Pizza in the oven");

setTimeout(() => {
  console.log("Pizza is ready!");
}, 3000);

console.log("Laying the table");
```

```text
Pizza in the oven
Laying the table
Pizza is ready!
```

3000 milliseconds are 3 seconds. Look at the order: "Laying the table" comes **before** "Pizza is ready!". `setTimeout` doesn't stop the script and wait. It sets the timer and goes on at once with the next line. Three seconds later, the function runs.

## On the page

The function can change the page, like any other:

```html preview
<p id="note">Wait for it...</p>
<script>
  setTimeout(() => {
    document.querySelector("#note").textContent = "Surprise!";
  }, 2000);
</script>
```

The page says "Wait for it...", and two seconds later "Surprise!". Change the code a little, and the preview starts again from the beginning: wait the two seconds again.

## A function, not a call

`setTimeout` needs the function itself, so it can call it later. A named function works too, written without brackets:

```js
const ring = () => {
  console.log("Ring!");
};

setTimeout(ring, 1000);
```

## Break it on purpose

Give it the function with brackets: `setTimeout(ring(), 1000)`. "Ring!" comes at once, not after a second. `ring()` calls the function right there, and `setTimeout` gets what it returns, which is nothing. It's the same mistake as with `addEventListener`: hand over the function, don't call it.

Then write the time in seconds: `setTimeout(ring, 2)`. It rings at once again: 2 milliseconds is too short to see. The time is always in milliseconds.

---

## Mission: Live data

The dashboard gets its numbers from the station's computers, which takes a moment. The crew should see that something is happening.

**Example**: when the page opens, under the last update, it says:

```text
Loading live data...
```

Two seconds later, the same line says:

```text
Live data loaded
```

- Under `#last-update`, a paragraph with the id `live-status`, which says `Loading live data...` when the page opens.
- Two seconds after the page opens, the script changes it to `Live data loaded`, once.

Psst, two seconds are 2000 milliseconds :)
