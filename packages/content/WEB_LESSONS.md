# Writing a Web Development lesson

Read this before writing or changing any lesson in `lessons/web-dev/`. Every lesson, old or new, has to pass the checklist at the end.

The model is the Python course: `python/print.md`, `python/variables-str.md`, `python/if-else.md`, `python/functions.md`. When a rule here is unclear, do what those lessons do.

The goal is a course nobody finds confusing, vague or intimidating. The number of lessons doesn't matter. Three short lessons are better than one long one.

## 1. One new idea per lesson

A lesson teaches one thing. If you need a second heading to teach something new, that's a second lesson.

- Bad: `first-page` teaches tags, elements, attributes, `<!DOCTYPE>`, `<head>`, `<meta charset>`, `<title>`, `<body>`, nesting and the workspace, all at once.
- Good: one lesson for "a tag and its closing tag", one for "the frame of a page", one for "the tab's title", and so on.

A lesson may _use_ everything taught before. It _introduces_ one idea.

## 2. Start from something the student already knows

Open with a problem or a moment from real life, then show how the new idea solves it.

- Good (`python/functions.md`): the same `for` loop is copied for each person, then a function writes it once.
- Good (`python/if-else.md`): "if it's colder than 15 degrees I take a sweater, else a t-shirt is enough."
- Bad (`web-dev/if-else.md`): "A boolean on its own only answers a question." This is abstract and gives the student nothing to picture.

## 3. Talk like a person

- Say "we", ask the reader things ("What do you see?"), and a `:)` now and then is fine.
- Explanations use everyday life: school, games, phones, the street, the kitchen. The space station belongs to the **mission**, not to the explanation. "Cargo Bay" and "hatch sign" mean nothing to a 14-year-old.
- Write short sentences with words a 14-year-old knows. Explain every technical word the first time it appears, in the same sentence.
- Examples are in English. No French or other languages to show a point.

## 4. Small steps you can see

- Each idea gets its own small code block: a few lines, never a whole page when one element makes the point.
- HTML and CSS examples are preview cells: ` ```html preview ` or ` ```css preview `. The block holds a whole small page, and the page it makes shows under it, so no ` ```text ` block describes it. The part the lesson is about goes between `<!-- show -->` and `<!-- /show -->` (or `/* show */` and `/* /show */` inside a `<style>`): only that part shows until the student presses View all the code, and the rest is just what that part needs to be seen. The rest uses only what has been taught by then, since the student can read it. A block whose whole code is the point has no markers. A block that shows nothing on a page (a `<link>`, a `<head>`, paths between files) stays a plain ` ```html ` block. Pictures in a cell come from the course's `assets/`, so an example names a picture the course has.
- Right after a block, say what the student will see: what the page shows, or the console's output in a ` ```text ` block, like Python's `Output:`.
- Then change one thing and show the new result. Python's `variables-str` prints three names, then shows the same code with one name changed.
- Tell the student to try it in the editor on the right: "Type this in `index.html` and look at the preview."

## 5. Break it on purpose

Every lesson shows at least one wrong version and what happens with it.

- The browser rarely shows an error for HTML or CSS. So the lesson says what you see instead: "delete the `</h1>` and look: everything after it is now a big heading too."
- For JavaScript, show the console's error and how to read it, as Python does: "read the errors, they tell you exactly what you did wrong."

## 6. Nothing before it's taught

No tag, property, word or function appears in the text, an example or the mission before the lesson that teaches it. The course map (one line per lesson, saying what it introduces) is the reference.

- Bad (`web-dev/if-else.md`): `null`, `undefined`, `NaN` and `querySelector` show up in one sentence about truthy values.
- Bad (`web-dev/box-model.md`): margin collapsing is explained in the same lesson that introduces margin.

If something is worth knowing but not taught yet, leave it for its own lesson.

## 7. The mission: a goal, with the finish line in sight

The mission asks for a result, not for code. It never repeats the example's values for the student to copy. The student must still always know where they start and when they're done.

- **Where you start.** Say which file to open and what's already in it ("Your `index.html` from the last lesson already has the heading.").
- **What done looks like.** Show the result: a picture of the finished page, or an **Example** block with what the page or the console shows, saying the student's own text may differ ("your page would show something like").
- **Only what's been taught.** The mission uses this lesson's idea and earlier ones, nothing else.
- **Few points, each visible.** One to four bullet points. Each one is something you can check by looking at the page or the console.
- **No hidden requirement.** Everything the tests check is said in the mission. A test never checks something the mission leaves to the student.
- **One "Psst".** End with a hint about the most common slip, as Python's `print` does: "Psst, don't forget the quotes :)".

Bad (`web-dev/box-model.md`): "a background of its own, so the card shows against the page, with its text still readable on it". You can't see the finish line, and "readable" is a hidden rule.

Bad (`web-dev/if-else.md`): "the first flight", "the boarding paragraph", "whatever the table holds". These refer to a page the lesson never describes.

## 8. Recaps and projects

- A recap says so at the top: "No new theory, just a challenge that uses …", with the ideas it uses named.
- A project lists its steps in order, each step one idea the part already taught.

## 9. Order of languages

The first part teaches HTML and CSS only. JavaScript starts in the second part, once the student is at home with a page (decided 2026-11-09).

## Checklist

Before a lesson goes for review, every answer is yes:

1. Does it introduce exactly one new idea?
2. Does it open with something from real life, or a problem the student already has?
3. Would a 14-year-old understand every sentence on the first read?
4. Does every idea have its own small example, with what you see right after it? Is every HTML and CSS example a preview cell?
5. Is there at least one wrong version, with what happens?
6. Is every tag, property, word and function in it taught in this lesson or an earlier one?
7. Does the mission say where you start and show what done looks like?
8. Is every point of the mission visible on the page or in the console, and said out loud?
9. Does the mission ask for a result without giving the example's values to copy?
10. Is the space station only in the mission?
