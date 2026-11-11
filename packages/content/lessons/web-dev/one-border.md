Look at a book's page with a quote on it: often there's just one line, down the left side of the quote, to set it apart. Not a box all round, just one side. A border can be like that too.

## One side's border

Every side has its own border property, written like `border`:

```css
.quote {
  border-left: 4px solid gold;
}
```

A 4-pixel gold line down the left side only. The other sides have no border.

There's one for each side: `border-top`, `border-right`, `border-bottom`, `border-left`. A line under a heading is often a `border-bottom`:

```css
h2 {
  border-bottom: 1px solid #2c4a7a;
}
```

Unlike `text-decoration: underline`, a bottom border runs the whole width of the box, not just under the words, and can have any thickness and color.

## One side and the others

You can also give a box a border all round, then change one side after it:

```css
.quote {
  border: 1px solid gray;
  border-left: 6px solid gold;
}
```

Thin and grey all round, thick and gold on the left. The later declaration wins for the side they share.

## Break it on purpose

Swap the two lines:

```css
.quote {
  border-left: 6px solid gold;
  border: 1px solid gray;
}
```

The gold line is gone. `border` sets all four sides, so coming second, it undoes the left one too. The general one first, the special one after.

---

## Mission: The duty board's edge

The duty board should look like a page with a quote, marked down one side.

**Example**: the duty list has a thick gold line down its left side, and no border on the other sides. Its left corners are square, where the line runs, and its right corners rounded.

- The duty list has a border on its left, at least 3 pixels thick.
- It has no border at its top, right and bottom.
- Its two right corners are rounded, and its two left ones aren't.

Psst, four values for the corners go round the clock from the top left :)
