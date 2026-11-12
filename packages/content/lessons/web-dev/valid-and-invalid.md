Type a wrong code on a phone, and the box turns red: you know at once that something is wrong. The browser already knows when a box holds a wrong answer: an email without an @, a number too big, a name too short. It's what makes it refuse to send a form. CSS can show it before anyone clicks send.

## `:invalid` and `:valid`

`:invalid` picks a box the browser would refuse to send. `:valid` picks a box it would send.

```css preview
<style>
  label {
    display: block;
  }

  /* show */
  input:invalid {
    border: 2px solid red;
  }

  input:valid {
    border: 2px solid green;
  }
  /* /show */
</style>
<form>
  <label for="age">Your age</label>
  <input type="number" id="age" name="age" min="10" max="18" />
  <label for="mail">Your email</label>
  <input type="email" id="mail" name="mail" />
</form>
```

Type 25 in the age box: the border turns red. Type 14: green. Type an email without an @: red.

Look at the boxes before you type: both are green. An empty box that isn't required counts as valid: there's nothing wrong in it.

## A required box starts red

```css preview
<style>
  label {
    display: block;
  }

  /* show */
  input:invalid {
    border: 2px solid red;
  }
  /* /show */
</style>
<form>
  <label for="player">Player name</label>
  <input id="player" name="player" required />
</form>
```

This box is red before anyone types. It's empty and `required`, so it's invalid. The page says "wrong!" to someone who hasn't even started. The next lesson fixes that.

## Break it on purpose

Write `:invalid` alone, without `input` in front:

```css preview
<style>
  label {
    display: block;
  }

  /* show */
  :invalid {
    border: 2px solid red;
  }
  /* /show */
</style>
<form>
  <label for="age">Your age</label>
  <input type="number" id="age" name="age" min="10" max="18" />
</form>
```

Type 25. The box turns red, but so does a frame around the whole form: a form with a wrong box in it is invalid too. Say which elements you mean: `input:invalid`.

---

## Mission: Wrong answers show

Your form already refuses wrong answers when the passenger clicks Book my seat. But nothing shows which box is wrong before that.

**Example**: type `ida.example.com` in the email box and click somewhere else on the page. The email box looks different, for example with a red border. Type `ida@example.com`: it looks normal again. For now, the boxes the form needs look wrong while they're empty.

- A box with an answer the browser would refuse (an email without an @, a name of one letter, 4 bags) looks different from a box with a good answer.
- A box with a good answer doesn't look wrong.

Psst, `:invalid` alone picks the form too :)
