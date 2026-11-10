No new theory: this project uses everything from the first three parts. Tables, the selectors of part 3, and a script that reads data, decides, filters, sorts and switches classes. You build a page of your own from an empty folder: a launch board for the station's rocket pads.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The steps

The launch crew watches this board all day. Make it clear, and make it keep itself up to date. Build it in this order:

1. **The frame.** An English page that can show any letter, called **Launch Board** on its tab and in its only biggest heading.
2. **The table.** A table with the id `launches`, with a caption of your choice. Its header row, in a `thead`, has **Rocket**, **Pad**, **Time** and **Status**, each a header saying it names its column.
3. **The launches.** In the table's body, at least five launches, with at least one of each status: `Scheduled`, `Scrubbed` and `Launched`. A time is written like `09:15`. Every cell of a launch has the class of its column: `rocket`, `pad`, `time` and `status`.
4. **Lines and stripes.** In `style.css`, the table is as wide as its column, with single lines between its cells, and zebra stripes in its body.
5. **The mouse.** A row under the mouse lights up, unlike any other row.
6. **Statuses.** Every status cell is bold, and no other cell. A scrubbed launch's row is struck through.
7. **Readable.** Everything is easy to read, and nothing sticks out sideways on a phone.
8. **Status classes.** `script.js`, loaded from the head and waiting for the page, gives every row the class of its status, in small letters: `scheduled`, `scrubbed` or `launched`.
9. **The summary.** A paragraph with the id `summary` counts the launches by status: `3 scheduled, 1 scrubbed, 1 launched`.
10. **The next launch.** A paragraph with the id `next-launch` names the earliest scheduled launch: `Next launch: Falcon at 09:15`, or `No launch scheduled` when there is none.
11. **A toggle.** A button with the id `hide-scrubbed`, saying **Hide scrubbed** and not pressed for a screen reader, hides the scrubbed launches with the class `hide-scrubbed` on the table. Then it says **Show scrubbed** and is pressed, and a second click brings them back.

Both paragraphs follow the table: change a launch in the HTML, and they change too.

Run the tests whenever you like: they tell you which steps are still missing.
