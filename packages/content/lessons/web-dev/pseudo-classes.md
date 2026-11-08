Some things about an element aren't written in the HTML at all: the mouse is over it, it has the keyboard's focus, it's the third row of its table. **Pseudo-classes** pick elements by states and places like these. They start with a colon.

## States

```css
a:hover { }          /* the mouse is over it */
a:focus-visible { }  /* it has the keyboard's focus */
button:disabled { }  /* it can't be used right now */
```

`:hover` is the classic: a row that lights up under the mouse, a link that changes color. But not everyone has a mouse. Someone who moves through a page with the **Tab** key needs to see where they are: that's `:focus-visible`, which the browser applies when the focus came from the keyboard. Browsers draw a focus ring of their own; never remove it without giving a clear one back.

## Places

```css
li:first-child { }        /* the first child of its parent */
li:last-child { }         /* the last */
tr:nth-child(2) { }       /* the second */
tr:nth-child(even) { }    /* the 2nd, 4th, 6th... */
tr:nth-child(odd) { }     /* the 1st, 3rd, 5th... */
p:not(.warning) { }       /* every p that isn't a .warning */
```

`:nth-child(even)` gives a table **zebra stripes**: every other row a shade darker, so the eye can follow a long row across.

A pseudo-class counts as much as a class when rules compete. So `tr:hover` and `tr:nth-child(even)` are equal, and the one written later wins: put the hover after the stripes, or a striped row won't light up.

---

## Mission: Live Board

- In the body of the flights table, every even row gets a background of `#13294f`.
- A body row under the mouse gets `#1d3b6e`, whatever its stripe.
- A navigation link under the mouse turns `#ffd166`.
- Any link that has the keyboard's focus gets an outline of `3px solid #ffd166`.
