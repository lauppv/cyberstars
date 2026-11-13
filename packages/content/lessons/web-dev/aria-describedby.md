Some people can't see the screen, and a **screen reader** reads the page out loud to them. When they move into a box, it says the box's label: "Nickname, edit text". But the red message under the box? The screen reader doesn't know it belongs to the box. Unless the page says so, the message stays silent, and the visitor never hears what to fix.

## `aria-describedby`

Attributes whose names start with `aria-` are written for screen readers: the page looks the same, but the screen reader says more. `aria-describedby` goes on the box. Its value is the id of the element that describes it:

```html
<label for="nickname">Nickname</label>
<input id="nickname" name="nickname" required aria-describedby="nickname-error" />
<p id="nickname-error"></p>
```

Now, when the visitor moves into the box, the screen reader reads its label, then the text of `#nickname-error`: "Nickname, edit text, A nickname has no spaces". While the paragraph is empty, there is nothing more to read.

Like `for` on a label, the value is an id with no `#`. The element must be there, with exactly that id.

## `aria-invalid`

`aria-invalid="true"` tells the screen reader that the box holds a wrong answer: it says "invalid" with the box. The script sets it when it writes the message, and sets it back to `"false"` when it removes the message:

```html preview
<form id="join">
  <label for="nickname">Nickname</label>
  <input id="nickname" name="nickname" required aria-describedby="nickname-error" />
  <p id="nickname-error"></p>
  <button type="submit">Join</button>
</form>
<p id="welcome"></p>
<script>
  const nickname = document.querySelector("#nickname");
  const nicknameError = document.querySelector("#nickname-error");
  const welcome = document.querySelector("#welcome");

  document.querySelector("#join").addEventListener("submit", (event) => {
    event.preventDefault();
    if (nickname.value.includes(" ")) {
      nicknameError.textContent = "A nickname has no spaces";
      nickname.setAttribute("aria-invalid", "true");
      welcome.textContent = "";
    } else {
      nicknameError.textContent = "";
      nickname.setAttribute("aria-invalid", "false");
      welcome.textContent = `Welcome, ${nickname.value}!`;
    }
  });
</script>
```

The page looks the same as before. The change is for the ear: type `Space Rocket`, click **Join**, and a screen reader in the box says "Nickname, invalid entry, A nickname has no spaces". Fix it and click again: no "invalid", no message.

`aria-describedby` stays in the HTML all the time: it only points at the paragraph. `aria-invalid` changes with the answer, so the script sets it.

## Break it on purpose

Point at an id that isn't there:

```html
<input id="nickname" name="nickname" required aria-describedby="nickname-message" />
<p id="nickname-error"></p>
```

The page looks exactly the same, and no error shows anywhere. But the screen reader looks for `#nickname-message`, finds nothing, and reads no message. A mistake you can't see is still a mistake: check that the id matches, letter by letter.

---

## Mission: An error you can hear

Your name box gets a message next to it, `#passenger-error`. But a passenger with a screen reader never hears it.

**Example**: book with a name of only spaces. On the screen, nothing new: the message shows under the name box, as before. A screen reader in the name box now says something like "Full name, invalid entry, Please write your name".

- The name box is described by `#passenger-error`, all the time.
- When the message shows, the name box is marked as wrong for a screen reader.
- Once a passenger books with a real name, the box isn't marked as wrong any more. When the page opens, it isn't either.

Psst, the id in `aria-describedby` has no `#` :)
