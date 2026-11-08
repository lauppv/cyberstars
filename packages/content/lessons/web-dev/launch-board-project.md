The last project of these three parts: a launch board for the station's rocket pads, starting from an empty folder. It brings together tables, the selectors of part 3, and a script that reads data, decides, filters, sorts and switches classes.

There's no example: everything you need is in the lessons before this one.

## Your files

Make `index.html`, `style.css` and `script.js` with **New file**.

## The brief

The launch crew watches this board all day. Make it clear, and make it keep itself up to date.

- It's an English page that can show any letter, called **Launch Board** on its tab and as its only title.
- The launches are a table with the id `launches` that a screen reader introduces with a title of your choice. Its columns are **Rocket**, **Pad**, **Time** and **Status**, each header saying it names its column, set apart from the launches.
- At least five launches, at least one with each status: `Scheduled`, `Scrubbed` or `Launched`. A time is written like `09:15`. Every cell of a launch is in the class of its column: `rocket`, `pad`, `time` and `status`.
- The look: the table across the column with single lines between its cells, zebra stripes in its body, a row under the mouse that lights up unlike any other, every status in bold and no other cell, and a scrubbed launch struck through. Everything easy to read, nothing sticking out on a phone.
- The script gives every row the class of its status, in small letters: `scheduled`, `scrubbed` or `launched`.
- A paragraph with the id `summary` counts the launches by status: `3 scheduled, 1 scrubbed, 1 launched`. A paragraph with the id `next-launch` names the earliest scheduled launch: `Next launch: Falcon at 09:15`, or `No launch scheduled` when there is none. Both follow the table.
- A button with the id `hide-scrubbed`, saying **Hide scrubbed** and telling a screen reader it isn't pressed, hides the scrubbed launches with a class `hide-scrubbed` on the table. Then it says **Show scrubbed** and is pressed, and a second click brings them back.

Run the tests whenever you like: they tell you what's still missing.
