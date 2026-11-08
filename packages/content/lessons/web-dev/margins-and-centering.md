On a wide screen, your pages go from one edge to the other. A line of text as long as the whole window is hard to follow: your eyes get lost on the way back to the start of the next line. Most sites keep their content in a column in the middle. Here's how.

## Centering a box

```css
.manifest {
  max-width: 600px;
  margin: 0 auto;
}
```

- `max-width` keeps the box narrower than the window, when the window is wide.
- `margin: 0 auto` means no margin on the top and bottom, and **`auto`** on the left and right. The browser shares the free space equally between the two sides, so the box sits in the middle.

It works on block boxes that are narrower than their parent. In a narrow window, the box simply takes the whole width, and there's no free space to share.

## Centering text is something else

`text-align: center` centers the **text inside** a box, but it doesn't move the box. `margin: 0 auto` moves the **box**, and the text inside stays on the left. Often you want one of them, sometimes both.

## Padding on the sides

A box exactly as wide as a phone's screen puts its text right against the edges. A little padding on the left and right keeps it away from them:

```css
.manifest {
  padding: 0 16px;
}
```

With `border-box`, that padding stays inside the box's `max-width`.

## The body is a box too

If you center the `body` itself, every page of the site gets the column at once, because everything sits inside it.

---

## Mission: Center Column

Both pages should be easy to read on a wide screen and on a phone.

- On a wide screen, the content of both pages sits in one column in the middle of the window, never wider than `960px`, starting right at the top of the window.
- The text never touches the edges of the column: keep some room on its left and right, at least `8px`.
- On the crew page, the box of cards sits in the middle of that column.
- On a phone, the column takes the whole width, and nothing sticks out.
