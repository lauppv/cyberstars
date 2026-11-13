On a phone, a line ends where there's no more room, and the browser moves the next word down. Most of the time that's fine. But sometimes it cuts between two words that belong together: "200" at the end of one line, and "m" at the start of the next. You read "200", and wonder: 200 what?

## `&nbsp;`

`&nbsp;` is a **non-breaking space**: it looks like a space, but the browser never ends a line there. The words on each side of it stay on one line.

Here are two boxes with room for about 15 letters a line. The first sentence has a normal space between `200` and `m`, the second has `&nbsp;`:

```html preview
<style>
  p {
    width: 150px;
    border: 1px solid gray;
    font-family: "Courier New", monospace;
    font-size: 16px;
  }
</style>
<!-- show -->
<p>The pool is 200 m long.</p>
<p>The pool is 200&nbsp;m long.</p>
<!-- /show -->
```

In the first box, the line ends after "200", and "m long." starts the next one. In the second, "200 m" goes down to the next line together.

## Where to use it

Between a number and its unit: `5&nbsp;kg`, `20&nbsp;°C`, `10&nbsp;minutes`. Between a title and a name: `Dr.&nbsp;Lind`.

Not between every word. A line can only end at a normal space, so text with too few of them can't fit in its box.

## Break it on purpose

Put `&nbsp;` between every word of the sentence:

```html preview
<style>
  p {
    width: 150px;
    border: 1px solid gray;
    font-family: "Courier New", monospace;
    font-size: 16px;
  }
</style>
<!-- show -->
<p>The&nbsp;pool&nbsp;is&nbsp;200&nbsp;m&nbsp;long.</p>
<!-- /show -->
```

Now the browser can't end the line anywhere, so the whole sentence stays on one line and runs out of its box. Use `&nbsp;` only where two words must stay together.

---

## Mission: Numbers that stay whole

Your fact boxes give numbers with their units, like 60 liters and 15 minutes. On a narrow phone, a number can end one line and its unit start the next.

**Example**: make the preview very narrow. In the greenhouse's fact box, "60 liters" moves to the next line as one piece, and never shows "60" alone at the end of a line.

- In each fact box, every number with its unit is in an element with the class `measure`, which holds just the number and its unit, like `60 liters`. Each fact box has at least two.
- A measure never splits over two lines, with the HTML alone. The tests take your CSS away and give each measure no room at all.

Psst, `&nbsp;` takes the place of the space, it doesn't go next to it :)
