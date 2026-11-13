In a chat app, you write a message and press Send. The page doesn't go blank and load again: your message simply shows in the chat. Many forms on the web work like that. The script answers at once, and the page stays where it is.

## What the browser does on its own

Many events come with something the browser does by itself afterwards: its **default action**. A click on a link opens the link. A form's `submit` sends the form and leaves the page. Your listener runs first, and then the default action happens.

## `event.preventDefault()`

`event.preventDefault()` tells the browser: "don't do your default action this time". In a `submit` listener, it stops the form from being sent:

```html preview
<form id="join">
  <label for="nickname">Nickname</label>
  <input id="nickname" name="nickname" required />
  <button type="submit">Join</button>
</form>
<p id="note"></p>
<script>
  const nickname = document.querySelector("#nickname");
  const note = document.querySelector("#note");

  document.querySelector("#join").addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent = `Welcome to the club, ${nickname.value}!`;
  });
</script>
```

Type `Rocket` and click **Join**. The page says `Welcome to the club, Rocket!`, and no `The form was sent` line shows under it: the form wasn't sent. Now the script decides what happens. (Later in the course, a script will send the answers to the server itself, without leaving the page.)

## The browser still checks

`preventDefault` stops the sending, not the browser's own checks. Clear the box and click **Join**: the browser shows its message, the box is required. It refused the form before any `submit` event, so the page doesn't welcome anybody.

## Break it on purpose

Forget the brackets:

```js
event.preventDefault;
```

Click **Join**: the page shows the welcome, and then the line under it says `The form was sent: nickname=Rocket`. No error either. Without brackets, the line only names the function, and nothing calls it. `preventDefault()` needs its `()` to run.

---

## Mission: Booked!

Your form still leaves for the station's server when it's sent. The station wants the page to answer the passenger at once, and the form not to be sent.

**Example**: type `Ida Moreau`, an email, pick the flight `SL-102` and a date, then click **Book my seat**. Under the buttons, the page says:

```text
Seat booked for Ida Moreau on SL-102
```

and no `The form was sent` line shows in the console.

- The form is no longer sent.
- Instead, an element with the id `confirmation`, under the buttons of the form, says `Seat booked for`, the name typed, `on`, and the code of the flight picked.
- When the browser refuses the form, `#confirmation` stays empty.

Psst, `preventDefault` needs its brackets :)
