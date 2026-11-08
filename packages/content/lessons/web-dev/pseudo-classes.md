Some things about an element aren't written in the HTML at all: the mouse is over it, the keyboard is on it, it's the third row of its table. **Pseudo-classes** pick elements by states and places like these. They start with a colon.

## States

```css
a:hover { }          /* the mouse is over it */
a:focus-visible { }  /* it has the keyboard's focus */
button:disabled { }  /* it can't be used right now */
```

`:hover` is the classic one: a row that lights up under the mouse, a link that changes color. But not everyone uses a mouse. Someone who moves through a page with the **Tab** key needs to see where they are. That's `:focus-visible`: the browser uses it when the focus came from the keyboard. Browsers draw their own focus ring. Never remove it without putting a clear one back.

## Places

```css
li:first-child { }        /* the first child of its parent */
li:last-child { }         /* the last */
tr:nth-child(2) { }       /* the second */
tr:nth-child(even) { }    /* the 2nd, 4th, 6th... */
tr:nth-child(odd) { }     /* the 1st, 3rd, 5th... */
p:not(.warning) { }       /* every p that isn't a .warning */
```

`:nth-child(even)` gives a table **zebra stripes**: every other row a bit darker, so your eyes can follow a long row across the table.

When rules compete, a pseudo-class counts as much as a class. So `tr:hover` and `tr:nth-child(even)` are equal, and the one written later wins. Put the hover rule after the stripes, or a striped row won't light up.

---

## Mission: Live Board

The departures board is long, and passengers lose their row. Help them:

- In the body of the flights table, every other row looks different from the ones next to it, like zebra stripes, with the text still easy to read.
- The row under the mouse lights up in a color of its own, unlike any other row, whatever its stripe.
- A navigation link under the mouse changes its look.
- Someone using the **Tab** key always sees which link they're on: give the link with the keyboard's focus a clear outline, at least `2px` thick.
