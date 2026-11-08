The last project of these three parts: a launch board for the station's rocket pads, from an empty folder. It brings together tables, the selectors of part 3, and a script that reads data, decides, filters, sorts and switches classes.

There's no example: everything you need is in the lessons before this one.

## Your files

Make `index.html`, `style.css` and `script.js` with **New file**.

## What the page holds

**The page**

- in English, able to show any letter, with **Launch Board** on its tab and as its one biggest heading;
- a table with the id `launches` and a caption, its header row in a `thead` with **Rocket**, **Pad**, **Time** and **Status**, each naming its column;
- in its `tbody`, at least five launches, at least one of each status, each cell in the class of its column: `rocket`, `pad`, `time` and `status`. A time is written like `09:15`, a status is `Scheduled`, `Scrubbed` or `Launched`;
- empty paragraphs with the ids `summary` and `next-launch`, and a button with the id `hide-scrubbed` that says **Hide scrubbed**, not pressed.

**The look**, in `style.css`

- the table spans the column, its borders collapsed;
- every even row of its body has a background of `#13294f`, the odd ones none, and a row under the mouse `#1d3b6e`, striped or not;
- every status cell is bold, and no other cell;
- a scrubbed row's cells are struck through.

**The script**, in `script.js`, deferred

- every row gets the class of its status in lowercase: `scheduled`, `scrubbed` or `launched`;
- the summary counts the launches by status: `3 scheduled, 1 scrubbed, 1 launched`;
- the next launch is the earliest scheduled one: `Next launch: Falcon at 09:15`, or `No launch scheduled` when there is none;
- the button toggles the class `hide-scrubbed` on the table, which hides the scrubbed rows, and switches between **Hide scrubbed** and **Show scrubbed**, pressed or not.
