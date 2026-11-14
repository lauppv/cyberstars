When you post a photo, the app shows it in your feed right away, with the date and the number of likes the server gave it. It doesn't reload the whole page, and what you see is what the server kept, not only what you typed. The tracker's form can work the same way.

## A form with a script behind it

You know the pieces from the boarding form: `submit`, `preventDefault`, the fields' `value`. Put them together with `fetch`, and a form sends its data without leaving the page:

```js
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const saved = await saveNote(noteInput.value);
  showNote(saved);
  noteInput.value = "";
});
```

- `preventDefault` keeps the browser from sending the form its own way, which would load a new page.
- The function given to `addEventListener` can be `async`, so it can `await`.
- It shows what the server **answered**, `saved`, not what was typed. The server may have changed it: trimmed spaces, made the first letter big, added an id. What it answered is the truth.
- Then the field is emptied, ready for the next one.

## When it fails

Sending can fail like loading can: the server says no, or there's no connection. So the same `try` and `catch` go around it, and the page says what went wrong. Since the message appears after a click, give its paragraph `aria-live`, so a screen reader reads it out.

## Break it on purpose

Leave out `preventDefault`. The form sends itself the browser's way, and in the preview you see its fields go by as a sent form, while your script runs too. On a real site, the page would reload, and the report would vanish with it. Then show `noteInput.value` instead of the answer: it looks the same, until the server changes something.

---

## Mission: Starship spotted

The report form under the tracker should send its starship to the practice API, and add it to the reports below.

**Example**: type `Comet Runner`, pick `Explorer`, press the button. A moment later, the reports list shows `Comet Runner Explorer`, and the name box is empty again. If the API says no, a line says something like `Couldn't report the starship: The tracker answered 400`.

- Between the form `sighting-form` and the list `reports`, a paragraph with the id `report-status`, read out loud politely when it changes.
- Sending the form doesn't send it the browser's way: it calls `reportShip` with the name and the class.
- Once the API answered, a copy of the template `report-template` shows the answered starship's name and class at the end of `#reports`, and the name box is emptied.
- When it fails, `#report-status` says `Couldn't report the starship: ` and the error's message, and no report is added.

Psst, show the starship from the answer, not from the boxes :)
