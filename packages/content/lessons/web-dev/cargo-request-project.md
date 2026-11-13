No new theory: this project uses everything from the first four parts. Boxes and their labels, the browser's own checks, the look of a form, and a script that reads what is typed, answers at once and stops a form that isn't right. You build a page of your own from an empty folder: a request form for the station's crew.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The steps

A supply ship flies up to the station every week. With this form, a crew member asks for something to come up on the next ship, and the supply office on Earth reads every request. A wrong request wastes a place on the ship, so the form helps the crew get it right. Build it in this order:

1. **The frame.** An English page that can show any letter, called **Cargo Request** on its tab and in its only biggest heading. It uses `style.css`, and `script.js`, loaded from the head and waiting for the page.
2. **The form.** A form with the id `request`. It goes to the supply office at `https://supply.example.com/requests` with the `post` method, so the answers don't show in the address. A button with the id `send` sends it.
3. **Who and what.** Three boxes, each with a label tied to it, and none can be left empty:
   - the crew member's name, with the id and name `crew`;
   - the item, with the id and name `item`, from 3 to 40 characters;
   - how many, with the id and name `quantity`: a whole number from 1 to 20, typed on a keyboard of numbers.
4. **The catalog code.** A box with the id and name `code`, with its label, which can't be left empty either. A code is two capital letters, a dash and four digits, like `FD-2041`, and the browser refuses any other code.
5. **Where it goes.** A list with the id and name `module`, with its label, to pick the part of the station the cargo goes to. The values it sends are `hab`, `lab`, `dock` and `greenhouse`; the words the crew reads are yours. No module is picked at first, and one must be picked.
6. **How urgent.** A group of three round buttons named `priority`, with the values `low`, `normal` and `urgent`, and a question over them that says what they are for. `normal` is picked at first. Each round button comes right before its label.
7. **Extras.** A box to tick, with the id and name `fragile` and the value `yes`, for cargo that breaks easily. A box for a longer note, with the id and name `notes`, which takes at most 200 characters. Both have their labels. A second button, with the id `clear`, empties the whole form and sends nothing.
8. **The look.** In `style.css`, the page's text is in a font without serifs, and every box, list and button of the form uses the same font. Each label sits above its box, one box a line. The round buttons and the box to tick are in a color of your choice. The send button stands out more than the clear button. Everything is easy to read, and nothing sticks out sideways on a phone.
9. **Help as you go.** A box with a wrong answer looks different from the others, but only once the crew member has typed in it and left it: a new, empty form shows nothing as wrong. The label of the chosen round button stands out from the other two.
10. **The kind of cargo.** The first two letters of a code say the kind of cargo: `FD` is food, `MD` is medicine and `TL` is tools. While the crew member types the code, a paragraph with the id `kind` says the kind: `Food`, `Medicine`, `Tools`, or `Unknown kind` for any other two letters. A code of an unknown kind keeps the form from being sent, and the browser says why.
11. **A real name.** A name of only spaces isn't a name, but the browser lets it through. When the form is sent with one, it stays on the page, and a paragraph with the id `crew-error`, next to the name box, says `Write your name`. For a screen reader, the box is marked as wrong and reads that paragraph with it. Once the name is right, the message goes away and the box isn't marked as wrong any more.

Run the tests whenever you like: they tell you which steps are still missing.
