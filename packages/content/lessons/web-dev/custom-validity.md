On many sign-up pages, you type your email twice. If the two don't match, the page refuses to go on: one of them has a typing mistake. No HTML attribute can say "this box must match that one". It's a rule of your own. But you can still hand it to the browser, so it refuses the form like it refuses an empty `required` box.

## `setCustomValidity`

Every box has a method, `setCustomValidity`, that takes a message. While the message isn't empty, the browser counts the box as wrong: it gets `:invalid`, and the browser refuses to send the form. When the visitor tries, the browser shows your message, in its own bubble:

```js
repeat.setCustomValidity("The two emails don't match");
```

An empty text, `""`, takes the message away, and the box is right again:

```js
repeat.setCustomValidity("");
```

## In a page

The script checks the rule each time the visitor types in either box:

```html preview
<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <label for="repeat">The same email again</label>
  <input type="email" id="repeat" required />
  <button>Sign up</button>
</form>
<script>
  const email = document.querySelector("#email");
  const repeat = document.querySelector("#repeat");

  function checkRepeat() {
    if (repeat.value !== email.value) {
      repeat.setCustomValidity("The two emails don't match");
    } else {
      repeat.setCustomValidity("");
    }
  }

  email.addEventListener("input", checkRepeat);
  repeat.addEventListener("input", checkRepeat);
</script>
```

Type `sofia@example.com` in the first box and `sofia@exampel.com` in the second, then click **Sign up**. Nothing is sent: the browser points at the second box, with your words, `The two emails don't match`. Fix it to `sofia@example.com`, click again:

```text
The form was sent: email=sofia@example.com
```

The check runs on both boxes, because the visitor can fix either one. And it runs while they type, before they click: the browser decides whether a form may go **before** the `submit` event, so a `submit` listener is too late to set the message.

## Break it on purpose

Leave out the `else`:

```js
function checkRepeat() {
  if (repeat.value !== email.value) {
    repeat.setCustomValidity("The two emails don't match");
  }
}
```

Type `sofia@example.com`, then `sofia@example.co` in the second box, then add the `m`. The two emails match now, but the browser still refuses the form. The message was set once, and nothing took it away. Without `setCustomValidity("")`, the box stays wrong forever.

---

## Mission: Someone to call

Your form asks for someone the station can call on Earth, with their name and their phone. Both are optional. But a name without a phone doesn't help: the station can't call them.

**Example**: fill in the form, type `Lena Moreau` as the person to call, and click **Book my seat**. The browser refuses the booking, points at the box for their phone and shows your message. `#confirmation` stays empty. Type their phone and book again: the seat is booked.

- While the box for their name has a name in it and the box for their phone is empty, the browser refuses the booking, with a message in your own words that says what is missing.
- With their phone, or with no name for them, the booking goes through as before.
- A name of only spaces doesn't count as a name.

Psst, take the message away again with `""` :)
