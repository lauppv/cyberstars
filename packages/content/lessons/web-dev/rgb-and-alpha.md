Put a sheet of tracing paper over a drawing. You still see the drawing, just softer, as if it were further away. Colors on a screen can be like that too: a little **see-through**.

## `rgb()`: the same mix, in numbers

You know a color is a mix of red, green and blue light. `rgb()` writes that mix with plain numbers from `0` (off) to `255` (full):

```css
h3 {
  color: rgb(0, 128, 96);
}
```

`rgb(0, 128, 96)`: no red, green at half, a bit of blue. A sea green. It's the same idea as a hex color, just easier to read and change: to make it a little bluer, you turn the last number up.

- `rgb(0, 0, 0)` is black, `rgb(255, 255, 255)` is white;
- `rgb(255, 0, 0)` is pure red;
- `rgb(29, 78, 137)` is exactly `#1d4e89`, the station's blue.

## A fourth number: see-through

Add a fourth number, the **alpha**, and the color becomes see-through:

```css
.note {
  color: rgb(0, 0, 0, 0.5);
}
```

Alpha goes from `0` to `1`:

- `1` is solid, as if there were no fourth number;
- `0.5` is half see-through: black text at 0.5 on a white page shows grey;
- `0` is completely invisible.

See-through text looks quieter than the text around it. That's handy for things that matter less: a date, a side note, an address.

## Break it on purpose

Write the alpha as a percent without saying so, or as a number above 1:

```css
.note {
  color: rgb(0, 0, 0, 50);
}
```

Anything above 1 counts as 1, so the text is solid black, not half see-through. Alpha is a number from 0 to 1, or a percent with its `%`: `50%`.

---

## Mission: Quieter details

Your designer sent two more colors: a slate grey for the shift headings, `rgb(84, 104, 125)`, and, for the station's address, the logo's blue made see-through, at 70%.

**Example**: Morning Shift and Night Shift show in slate grey, and the address in a softer blue than the part headings.

- The shift headings are `rgb(84, 104, 125)`.
- The address paragraph has the class `address`, and its text is the logo's blue, `rgb(29, 78, 137)`, at an alpha of `0.7`.

Psst, the alpha is the fourth number, from 0 to 1 :)
