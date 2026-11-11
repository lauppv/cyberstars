No new theory: this project uses everything from parts 1 and 2. Lists, boxes and layout, and scripts that read the page, count, loop, use functions and build elements. You build a page of your own from an empty folder: the cargo bay's ledger.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The steps

The cargo master writes down every crate that comes on board, and wants a page that does the sums for her. Build it in this order:

1. **The frame.** `index.html` is in English, can show any letter, and is called **Cargo Ledger** on its tab and in its only biggest heading.
2. **The crates.** A list with the id `cargo`, with at least four crates. Each one names what's inside, in a `span` with the class `item`, and its weight in kilograms, the number alone in a `span` with the class `weight`: **Water: 120 kg**.
3. **The script.** `script.js` is loaded from the head, and waits for the whole page.
4. **The total.** Under the list, a paragraph with the id `total`, like `Total: 450 kg in 4 crates`, worked out from the weights on the page.
5. **The average.** A paragraph with the id `average`, the average weight rounded to the nearest whole number: `Average: 113 kg`.
6. **A new crate.** A button with the id `new-crate`, saying **New crate**, adds a crate of `Spare parts` weighing `25` kg at the end of the list, built with `createElement`. The total and the average follow.
7. **A column.** In `style.css`, every element counts its border and padding in its width, and the page sits in a column in the middle of the window, at most `640px` wide.
8. **A panel.** The list is a panel of its own: a background the page doesn't have, room inside, a border and rounded corners.
9. **Readable, on a phone too.** Everything is easy to read, and nothing sticks out sideways on a phone.

**Example**: a finished ledger could show something like this:

```text
Cargo Ledger

• Water: 120 kg
• Seeds: 15 kg
• Tools: 230 kg
• Medicine: 85 kg

Total: 450 kg in 4 crates
Average: 113 kg

[New crate]
```

Run the tests whenever you like: they tell you which steps are still missing.
