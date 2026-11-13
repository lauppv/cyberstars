In the Focus lesson, you gave the links a ring for people who move with the Tab key. Now click a link with the mouse instead: the ring shows too. For someone with a mouse, a ring after a click looks like a mistake. So some websites remove the ring, and people with a keyboard can't see where they are. There's a better answer: a ring only for the keyboard.

## `:focus-visible`

```css preview
<style>
  /* show */
  button:focus-visible {
    outline: 3px solid gold;
  }
  /* /show */
</style>
<button>Play</button>
<button>Pause</button>
<button>Stop</button>
```

Click a button with the mouse: no ring. Now press Tab: the ring shows on the button you're on, and moves with every press.

`:focus-visible` means "has the focus, and the browser thinks the visitor should see it". The browser decides: after a click, the visitor knows where they are. After Tab, they need the ring.

## A box you type in

In a box you type in, the ring shows even after a click:

```css preview
<style>
  /* show */
  input:focus-visible {
    outline: 3px solid gold;
  }
  /* /show */
</style>
<label for="nick">Nickname</label>
<input id="nick" />
<input type="checkbox" id="news" />
<label for="news">Send me the club news</label>
```

Click in the nickname box: a ring. The browser knows you're going to type there, so it shows where your letters will go. Now click the box to tick: no ring. Press Shift+Tab: the ring goes back to the nickname box. Press Tab: the focus goes to the box to tick again, and this time the ring shows.

## Break it on purpose

Use `:focus` instead:

```css preview
<style>
  /* show */
  button:focus {
    outline: 3px solid gold;
  }
  /* /show */
</style>
<button>Play</button>
<button>Pause</button>
<button>Stop</button>
```

Click a button: the ring shows, and stays until you click somewhere else. With `:focus-visible`, mouse users don't get that ring.

And as in the Focus lesson: never take the ring away with `outline: none`. Without it, someone with a keyboard can't see where they are.

---

## Mission: A ring for the keyboard

Your booking form uses the browser's own thin ring, which is hard to see on the night blue page.

**Example**: click in the name box and press Tab. The email box gets a thick ring in a color of your choice. Click a round button or the Clear the form button with the mouse: no ring.

- A box, the flight list, the notes box or a button reached with Tab gets a ring (an outline) at least 2 pixels thick, in a style you chose, not the browser's own.
- A click with the mouse on a round button, a box to tick or a button draws no ring.

Psst, the ring is the outline from the Focus lesson: only the selector changes :)
