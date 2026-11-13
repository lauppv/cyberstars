No new theory: this project uses everything from the first seven parts. A form, a list built from an array of objects, `localStorage` with JSON, the focus, a live region and a dark mode. You build a page of your own from an empty folder: a to-do list that remembers your tasks.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make three files with **New file**: `index.html`, `style.css` and `script.js`.

## The steps

You'll use this list every day, on your computer and on your phone, in the morning and late at night. Build it in this order:

1. **The frame.** An English page that can show any letter and is made for the width of a phone, with one sentence about the list for search engines. It's called **My Tasks** on its tab and in its only biggest heading.
2. **The parts.** A form with the id `task-form` holds a field with the id `task-input`, with a label tied to it, and a button that sends the form. Under the form, an empty list with the id `task-list`, a paragraph with the id `task-count`, read out loud politely when it changes, and a button with the id `clear-done`.
3. **Adding a task.** `script.js`, loaded from the head and waiting for the page, keeps the tasks in an array of objects, each with its text and whether it's done. Sending the form adds a task at the end of the list, without sending the form anywhere. Then the field is empty again, and the focus is in it, ready for the next task. An empty field, or one with only spaces, adds nothing.
4. **What a task shows.** Each task of the list is an `li` with, in this order, a box to tick, its text in a `span` with the class `task-text`, and a button with the class `delete`. The page draws the whole list again from the array after every change.
5. **Done.** Ticking a task's box marks it done: its `li` gets the class `done`, and its text is crossed out. Unticking it brings it back.
6. **Delete.** A task's delete button removes that task, and only that one.
7. **What's left.** `#task-count` says how many tasks are not done yet: `2 tasks left`, `1 task left`, or `Nothing left to do`.
8. **Remembered.** After every change, the tasks are saved in the browser as JSON under the key `tasks`. When the page opens, it shows the saved tasks, done or not.
9. **Clean up.** A click on `#clear-done` removes every done task, and saves.
10. **Day and night.** The page's colors are custom properties. It's light by default and dark when the device asks for dark mode, and its text is always readable, with a contrast of at least 4.5.
11. **On a phone.** The list stays in one readable column, at most 600 pixels wide on a computer, and nothing sticks out sideways on a phone, even with a long task.

The tests also try your page with tasks saved on an earlier visit, so read them from the browser with the key and the shape given in the steps.

Run the tests whenever you like: they tell you which steps are still missing.
