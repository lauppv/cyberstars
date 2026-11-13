You fill in a long sign-up form and press the button at the bottom. A red line appears: "Something is wrong." Which box? You scroll up and down, looking for it. A good form puts each message right next to the box it is about, so you see at once what to fix, and where.

## A place for the message

Give the message an element of its own, right after its box, empty at first:

```html
<label for="nickname">Nickname</label>
<input id="nickname" name="nickname" required />
<p id="nickname-error"></p>
```

An empty paragraph shows nothing. The script writes in it when the answer is wrong.

## Write it, and remove it

The club wants nicknames with no spaces in them. The browser can't check that with `required`, so the script does, when the form is sent:

```html preview
<form id="join">
  <label for="nickname">Nickname</label>
  <input id="nickname" name="nickname" required />
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
      welcome.textContent = "";
    } else {
      nicknameError.textContent = "";
      welcome.textContent = `Welcome, ${nickname.value}!`;
    }
  });
</script>
```

Type `Space Rocket` and click **Join**: under the box, the page says `A nickname has no spaces`. Change it to `SpaceRocket` and click again: the message is gone, and the page says `Welcome, SpaceRocket!`.

The `else` does two jobs. It welcomes the visitor, and it empties the message, with `textContent = ""`. The `if` does two jobs too: it writes the message, and it empties the welcome of an earlier try, so the page never says both at once.

## Break it on purpose

Leave out the line that empties the message:

```js
} else {
  welcome.textContent = `Welcome, ${nickname.value}!`;
}
```

Type `Space Rocket`, click, then fix it to `SpaceRocket` and click again. The page says `Welcome, SpaceRocket!`, and still `A nickname has no spaces` under the box. The visitor fixed it, but the page says they didn't. A message that you write, you must also remove.

---

## Mission: Next to the name

When a passenger books with a name of only spaces, your page says `Please write your name` under the buttons, far from the name box. A passenger may not even see it there.

**Example**: book with three spaces as the name. Right under the name box, the page says `Please write your name`, and nothing shows under the buttons. Type `Ida Moreau` and book again: the message is gone, and under the buttons the page says `Seat booked for Ida Moreau on SL-102`.

- An element with the id `passenger-error`, right after the name box, says `Please write your name` when a passenger books with a name of only spaces. It is empty when the page opens.
- Then `#confirmation` is empty, even after an earlier booking.
- Once a passenger books with a real name, `#passenger-error` is empty again.

Psst, a message you write must also be removed :)
