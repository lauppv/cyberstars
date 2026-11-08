On a wide screen, your pages stretch from edge to edge: lines of text a whole window long, hard to follow from the end of one to the start of the next. Most sites keep their content in a column in the middle. Here's how.

## Centering a box

```css
.manifest {
  max-width: 600px;
  margin: 0 auto;
}
```

- `max-width` keeps the box narrower than the window, when the window is wide.
- `margin: 0 auto` means no margin on top and bottom, and **`auto`** on the left and right: the browser splits the free room equally between the two sides, so the box sits in the middle.

It works on block boxes with a width narrower than their parent. On a narrow window the box simply takes the whole width, and there's nothing to split.

## Centering text is something else

`text-align: center` centers the **text inside** a box; it doesn't move the box. `margin: 0 auto` moves the **box**; the text inside stays left. You'll often want one, sometimes both.

## Padding on the sides

A box exactly as wide as a phone's window puts its text right against the screen's edges. A little padding on the left and right keeps it off them:

```css
.manifest {
  padding: 0 16px;
}
```

With `border-box`, that padding stays inside the box's `max-width`.

## The body is a box too

Center the `body` itself, and every page of the site gets the column at once, since everything sits inside it.

---

## Mission: Center Column

- Center both pages in a column at most `960px` wide, with `16px` of padding on its left and right, and no margin above it.
- Center the box of cards inside that column.
