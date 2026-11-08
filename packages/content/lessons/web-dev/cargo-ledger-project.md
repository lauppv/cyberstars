Part 2 taught you boxes and layout, lists, and scripts that count, loop, use functions and build elements. Your second project puts them together in a page of its own, starting from an empty folder: the cargo bay's ledger.

Like last time, there's no example. Everything you need is in the lessons of parts 1 and 2.

## Your files

Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The brief

The cargo master writes down every crate that comes on board, and wants a page that does the sums for her.

- It's an English page that can show any letter, called **Cargo Ledger** on its tab and as its only title.
- The crates are a list with the id `cargo`, at least four of them. Each one names what's inside, in an element in the class `item`, and its weight in kilograms, a number in an element in the class `weight`, both inside their line: **Water: 120 kg**.
- Under the list, a paragraph with the id `total` sums it up, like `Total: 450 kg in 4 crates`, and a paragraph with the id `average` gives the average weight, rounded to a whole number: `Average: 113 kg`. Both follow the numbers on the page: change a weight in the HTML, and they change too.
- A button with the id `new-crate` that says **New crate** adds a crate of `Spare parts` weighing `25` kg at the end of the list, built the safe way. Both paragraphs follow.
- The look comes from `style.css`: every element counts its border in its width, the content sits in a column in the middle of the window, at most `640px` wide, and the list looks like a panel of its own, with a background, room inside, a frame and rounded corners. Everything is easy to read, and nothing sticks out on a phone.

Run the tests whenever you like: they tell you what's still missing.
