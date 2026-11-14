When a video doesn't load on your phone, the app doesn't just say "error" and leave you there. It shows a button: "Tap to retry". The problem may be gone a second later: the train left the tunnel, the Wi-Fi came back. One tap, and you're watching.

## A button that shows only after an error

The `hidden` attribute hides an element, and a script can switch it on and off through the property of the same name:

```js
const retry = document.querySelector("#retry");
retry.hidden = false; // shows it
retry.hidden = true; // hides it again
```

Write the button in the HTML with `hidden`, so it doesn't show while all is well. In `catch`, show it.

## Loading again

A click on the button starts the load again. It's the same load as when the page opened, so it calls the same function. Before that, it puts the page back as it was then: the button hidden, the loading line back.

```js
retry.addEventListener("click", () => {
  retry.hidden = true;
  newsLine.textContent = "Loading the news...";
  loadNews();
});
```

Here you see why `loadNews` makes the list busy at its start, not only in the HTML: the second load gets its skeletons too. And if it fails again, `catch` shows the button again.

## Break it on purpose

Forget `retry.hidden = true;` in the click. The button stays while the page loads, and a visitor clicks it five times: five loads at once, five copies of every card. Then forget the loading line: the old error message stays on the screen while the new load is already running.

---

## Mission: Try again

After an error, the visitor should be able to try again without reloading the whole page.

**Example**: with the broken address, the line says what went wrong, and a button `Try again` shows under it. Click it: the button goes, the line says it's loading, the skeletons shimmer. If it fails again, the button comes back.

- Between `#tracker-status` and the list `ships`, a button with the id `try-again`, of type `button`, hidden until an error.
- After an error, or with no connection, the button shows. When all goes well, it never shows.
- A click on it hides it, puts `Loading` back in `#tracker-status` and loads again, the list busy until the answers are in.

Psst, `hidden` in the HTML hides it on the first load, and the script shows it :)
