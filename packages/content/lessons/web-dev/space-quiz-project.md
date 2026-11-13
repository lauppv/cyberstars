No new theory: this project uses everything from part 8 and before it. `fetch` and JSON, `async` and `await`, `try` and `catch`, destructuring, buttons made by a script and a live region. You build a page of your own from an empty folder: a quiz that loads its questions from a file.

This is a project of its own, outside the station site. Whenever you're not sure how to do a step, open the lesson it comes from again.

## Your files

The folder starts empty. Make four files with **New file**: `index.html`, `style.css`, `quiz.js` and `questions.json`.

## Why the questions are in a file

You could write the questions in the script. But then changing a question means changing the code. With the questions in a file of their own, anyone can add one without touching the script, and the page loads them with `fetch`, the way it would load them from a server. A path of your own site works with `fetch` like any address: `fetch("questions.json")`.

## The steps

Build it in this order:

1. **The frame.** An English page that can show any letter and is made for the width of a phone, with one sentence about the quiz for search engines. It's called **Space Quiz** on its tab and in its only biggest heading.
2. **The questions.** `questions.json` holds an array of at least three questions about space, each an object with the `question`, its `answers` (an array of texts) and `correct`, the place in that array of the right answer, counted from 0, like this:

   ```json
   [{ "question": "Which star is the closest to Earth?", "answers": ["Sirius", "The Sun"], "correct": 1 }]
   ```

3. **The parts.** Under the heading: a paragraph with the id `quiz-status`, a heading with the id `question`, a box with the id `answers`, a paragraph with the id `feedback`, and a button of type `button` with the id `next`, hidden. A screen reader reads `#quiz-status` and `#feedback` out politely when they change.
4. **Loading.** `quiz.js`, loaded from the head and waiting for the page, loads `questions.json` with `fetch` when the page opens. When the file is missing, or isn't JSON, `#quiz-status` says `Couldn't load the questions: ` and the error's message, and nothing is thrown.
5. **A question.** Once loaded, the first question shows: `#quiz-status` says `Question 1 of 3` (with your own number of questions), `#question` holds the question, and `#answers` holds a button of type `button` for each answer, in the file's order.
6. **Answering.** A click on an answer says in `#feedback` `Right!`, or `Not quite: the answer is ` and the right answer. Then no answer of that question can be pressed any more, and `#next` shows.
7. **The next question.** A click on `#next` shows the next question the same way, `#feedback` empty and `#next` hidden again.
8. **The score.** After the last question, `#next` shows the score instead: `#quiz-status` says `You got 2 of 3 right` (with the real numbers), and the question, the answers and `#next` are gone.
9. **On a phone.** The answers stand one under the other, readable with a contrast of at least 4.5, and nothing sticks out sideways.

The tests also try your page with questions of their own in `questions.json`, so the page must work with any questions written the same way.

Run the tests whenever you like: they tell you which steps are still missing.
