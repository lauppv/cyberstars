No new theory: this project uses everything from the first five parts. Landmarks, `display: flex` and `position`, and a script that opens a menu and listens to many buttons at once. You build a page of your own from an empty folder: the home page of a spaceport that sells trips to watch a rocket launch.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The steps

Families open this page to pick a trip and watch a launch with their own eyes. Many of them open it on a phone. Make it clear on a phone and on a computer. Build it in this order:

1. **The frame.** An English page that can show any letter and is made for the width of a phone, with one sentence about the spaceport for search engines. It's called **Lyra Spaceport** on its tab and in its only biggest heading.
2. **The landmarks.** A header holds the biggest heading, a button with the id `menu-button` that says **Menu**, and a menu: a `nav` with the id `menu` and a name for screen readers. After the header comes the page's own part, and at the end a footer with the spaceport's address.
3. **The header bar.** On a computer, the header is one line: the name at the left, and the Menu button at the far right.
4. **Always at the top.** When the page scrolls, the header stays at the top of the window, and nothing that scrolls under it covers it.
5. **The trips.** A section with the id `trips` has a heading, a sentence about the trips, and the trips together in a `div` with the class `trip-list`. Each trip is an `article` with the class `trip`: its name in an `h3`, its price in euros, a sentence or two about what the visitor sees, and a button to choose it. Make at least three trips, for example a seat on the stands, a launch at night and a pass for a family.
6. **Side by side.** On a computer, at least three trips stand side by side, with room between them. When a row has no more room, the next trip goes to a new row, so on a phone they stand one under the other. Nothing sticks out sideways.
7. **The cards.** The trip people buy most says **Best seller** in a `span` with the class `badge`, inside the top right corner of its card. Every card has its button at the bottom, even when its text is shorter than the other cards' text.
8. **Your visit.** After the trips section, an `aside` has a paragraph with the id `choice`, which says `No trip chosen yet`, and a short list of what to bring. On a computer it stands to the right of the trips, between 200 and 400 pixels wide. On a phone it goes under them.
9. **The menu.** `script.js`, loaded from the head and waiting for the page, keeps the menu hidden until someone presses the Menu button. Then the menu opens right under the button, over the page, with its links one under the other: to the trips, to your visit and to the footer. The button tells a screen reader whether the menu is open. A second press closes it.
10. **A link closes it.** When the visitor picks a link in the menu, the menu closes too.
11. **Choosing a trip.** A trip's button gives its card the class `chosen`, which makes the card stand out from the others. Only one card is chosen at a time. The paragraph `choice` then says `You chose: Night Launch`, with the name from the trip's heading. It works for every trip, also for a trip you add to the HTML later.

The tests also try your `style.css` and `script.js` on pages with other trips. Those pages have only the elements, ids and classes named in the steps, so style your page and find its parts by those names.

Run the tests whenever you like: they tell you which steps are still missing.
