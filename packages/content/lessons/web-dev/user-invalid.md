Imagine a teacher who marks your test wrong before you've written a single word. That's what the last lesson's form does: the boxes the form needs are red as soon as the page opens. A good form waits until you have tried.

## `:user-invalid`

`:user-invalid` picks a box the browser would refuse, but only once the visitor has tried it: typed in it and then left it, or tried to send the form.

```css preview
<style>
  label {
    display: block;
  }

  /* show */
  input:user-invalid {
    border: 2px solid red;
  }
  /* /show */
</style>
<form>
  <label for="player">Player name</label>
  <input id="player" name="player" required minlength="3" />
  <label for="mail">Email</label>
  <input type="email" id="mail" name="mail" required />
  <button>Join</button>
</form>
```

Nothing is red at the start. Type `Al` in the name box: still nothing, you're still typing. Now click in the email box: the name box turns red, since `Al` is too short. Click back in the name box and type a third letter: the red border disappears at once.

## Sending counts too

Click **Join** with both boxes empty. The browser refuses the form, and now both boxes turn red. The visitor tried to send, so it's time to show what's missing.

`:user-invalid` works on a list (`select`) too: a required list with nothing picked turns red once the visitor tries to send.

## Break it on purpose

Change it back to `:invalid`:

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
  <input id="player" name="player" required minlength="3" />
  <label for="mail">Email</label>
  <input type="email" id="mail" name="mail" required />
  <button>Join</button>
</form>
```

Both boxes are red before you touch anything. Same rule, one word different, and the page feels much less friendly.

---

## Mission: Wait for the passenger

Your booking form marks the empty name, email and date boxes as wrong as soon as the page opens.

**Example**: open the boarding page: no box looks wrong. Type `ida.example.com` in the email box and click somewhere else: only the email box is marked. Click Book my seat with the form empty: the name, the email, the flight list and the date are marked.

- No box and no list is marked before the passenger has tried it.
- A box with a wrong answer is marked once the passenger leaves it, and every box or list with a wrong or missing answer is marked once they try to send.
- A box that is fixed is no longer marked.

Psst, mark the flight list too, not only the boxes :)
