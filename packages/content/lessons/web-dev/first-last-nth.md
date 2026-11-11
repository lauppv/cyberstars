Look at a printed bank statement or a big timetable: the rows are often shaded every other line, white, grey, white, grey. It's called **zebra stripes**, and it stops your eye slipping to the wrong line. CSS can pick every other row by its place.

## First and last

```css
li:first-child {
  font-weight: bold;
}

li:last-child {
  color: gray;
}
```

`:first-child` picks an element when it's the **first** child of its parent, `:last-child` when it's the last. In a list, that's the first and last items.

## `:nth-child`

`:nth-child(...)` picks children by their number, counting from 1:

```css
tr:nth-child(3) {
  color: gold;
}
```

Only the third row. Inside the brackets, you can also write:

- `even`: the 2nd, 4th, 6th...
- `odd`: the 1st, 3rd, 5th...

```css
#scores tbody tr:nth-child(even) {
  background-color: #13294f;
}
```

Every even row of the table's body is shaded: zebra stripes. Add a row, and the stripes follow, with no class to add by hand.

## Break it on purpose

Put the `:nth-child` on the cells instead of the rows:

```css
#scores td:nth-child(even) {
  background-color: #13294f;
}
```

Now it's every second **cell** of each row: stripes go down the columns instead of across. `:nth-child` counts the element it's on, among its own siblings.

---

## Mission: Zebra stripes

The flight table's rows all look the same, and it's easy to slip from one to another.

**Example**: in the flight table's body, every second row has a background of its own, starting with the second flight, while the other rows stay as they were.

- The even rows of the flight table's body have a background the odd rows don't have.

Psst, `:nth-child` goes on the row :)
