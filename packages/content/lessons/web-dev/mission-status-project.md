No new theory: this project uses everything from the first six parts. Grids that fit every width, media queries written phone first, and a script that works with arrays, objects, dates and timers. You build a page of your own from an empty folder: the status page of a rover driving on Mars.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The steps

The rover team opens this page all day: on the big screen in the control room, and on their phones on the way home. Make it clear at every width. Build it in this order:

1. **The frame.** An English page that can show any letter and is made for the width of a phone, with one sentence about the rover for search engines. It's called **Rover Status** on its tab and in its only biggest heading. No heading level is skipped.
2. **The parts.** A header holds the biggest heading, a paragraph with the id `clock`, and a paragraph with the landing day in a `span` with the id `landing`, written like `2031-02-18`, and an empty `span` with the id `days-on-mars`. Then a `main` with the class `layout` holds a section with the class `readings` and an `aside` with the id `log`: a heading, a list of what the rover did today, a button with the id `refresh`, and a paragraph with the id `updated` that says `Not updated yet`. After the main part, a section with the id `checks` has a heading and two paragraphs, with the ids `warnings` and `summary`. A footer ends the page.
3. **The readings.** The readings section holds at least four readings, each an `article` with the class `reading`: its name in an `h2`, and its number, from 0 to 100, in a `span` with the class `value`, followed by its unit. The battery's reading has the id `battery`. Each reading has a background of its own, with its name and its number in the middle across.
4. **A grid for every width.** The readings take as many columns as fit, each at least 200 pixels wide, all the same width, across the whole section, with at least 16 pixels between them.
5. **The battery first.** Whenever the readings stand in at least two columns, the battery's reading is as wide as two. When they stand in one column, on a phone, it takes one, like the others.
6. **The log beside them.** On a computer, the log stands to the right of the readings, between 250 and 350 pixels wide. In a window 700 pixels wide or narrower, it goes under them. On a phone, the readings stand one under the other, and nothing sticks out sideways at any width.
7. **What to check.** `script.js`, loaded from the head and waiting for the page, makes an array of the readings, each an object with its name and its number. `#warnings` says `Check: ` and the names of the readings under 20, in the page's order, with a comma and a space between them, or `All readings are fine` when none is under 20.
8. **The summary.** `#summary` says how many readings there are, then `readings, highest: `, the name of the reading with the highest number, and that number in brackets: `5 readings, highest: Wheels (91)`.
9. **Mission time.** `#clock` says `Mission time: `, then the time with hours from 00 to 23, minutes and seconds, each in two digits, like `14:05:09`. It shows as soon as the page opens, and moves on every second.
10. **Days on Mars.** `#days-on-mars` says how many whole days have passed since the landing day, then ` days on Mars`. A day that has only started doesn't count yet.
11. **Refresh.** A click on `#refresh` makes `#updated` say `Updated at `, then the time of the click as American English writes it, like `2:05 PM`.

The tests also try your `style.css` and `script.js` on pages with other readings and another landing day. Those pages have only the elements, ids and classes named in the steps, so style your page and find its parts by those names.

Run the tests whenever you like: they tell you which steps are still missing.
