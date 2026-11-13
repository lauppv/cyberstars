No new theory, just a challenge that uses this part's CSS: grids with their columns, shares and rows, items over several cells, where an item sits in its cell, the layout drawn in words, `repeat()`, `minmax()` and `auto-fit`, flex or grid, media queries and their breakpoints, the phone first, and pictures for each screen.

At the end of the dashboard, the station's picture and the photo of the Earth come one under the other, with a lot of empty room beside them on a computer.

---

## Mission: The gallery

**Example**: on a computer, the two parts stand side by side, each half of the page's width: the station on the left with its picture and caption in the middle of its part, the Earth on the right. On a phone, one under the other, as now.

- A box with the class `gallery` holds the two parts, the station's and the Earth's, each one with its heading and its figure.
- The two parts stand side by side, as wide as each other and across the whole gallery, with at least 16 pixels between them, as long as each one can be at least 300 pixels wide. Narrower than that, one under the other.
- In the station's part, the picture and its caption stand in the middle across, each one only as wide as it is. The photo of the Earth is still as wide as its figure, and still the square one on a phone.
- Nothing sticks out sideways, on a phone too.

Psst, two parts of 300 pixels, a gap, and the page's padding: work out the breakpoint before you write it :)
