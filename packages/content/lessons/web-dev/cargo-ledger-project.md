Part 2 taught you boxes and layout, lists, and a script that counts, loops, uses functions and builds elements. Your second project puts them together in a page of its own, from an empty folder: the cargo bay's ledger.

As before, there's no example: everything you need is in the lessons of parts 1 and 2.

## Your files

Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## What the page holds

**The page**

- in English, able to show any letter, with **Cargo Ledger** on its tab and its one biggest heading;
- a list with the id `cargo` of at least four crates. Each item names what's in it, in a span in the class `item`, and its weight in kilograms, a number in a span in the class `weight`: `<span class="item">Water</span>: <span class="weight">120</span> kg`;
- an empty paragraph with the id `total` and another with the id `average`;
- a button with the id `new-crate` that says **New crate**.

**The look**, in `style.css`

- every element counts its border in its width;
- the content in a centered column at most `640px` wide;
- the list as a panel: a background, padding, a border and rounded corners of your choice;
- nothing to scroll sideways on a phone.

**The script**, in `script.js`, deferred

- the total paragraph says the total weight and how many crates there are: `Total: 450 kg in 4 crates`;
- the average paragraph, the average weight rounded to a whole number: `Average: 113 kg`;
- a click on **New crate** adds a crate of `Spare parts` weighing `25` kg at the end of the list, built the safe way, and both paragraphs follow.

The numbers come from the page: change a weight in the HTML and the paragraphs follow it.
