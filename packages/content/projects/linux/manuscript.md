Serena has finished the first version of her short novel, The Keeper: six chapters, one text file for each. Before the book is printed, her editor sent her a list of changes: a table of contents, the notes she left for herself found, no double spaces, fewer "Suddenly"s, and a new name for the main character. Serena writes beautifully but hates small, slow edits. You will make them in the terminal.

**What you start with.** Six files in `~/novel`, from `chapter-01.txt` to `chapter-06.txt`. The first line of each chapter is its title.

**What you make.**

- `contents.txt` in `novel`: the six titles, in order
- the six chapters, changed: no double spaces, and the new name
- `~/the-keeper.txt`: the whole book in one file

Some words you will meet:

| Word              | What it means                                                         |
| ----------------- | --------------------------------------------------------------------- |
| draft             | a first version of a text, before it is finished                      |
| editor            | the person who reads a book before it is printed and asks for changes |
| table of contents | the list of the chapter titles at the start of a book                 |
| word edge         | the place where a word starts or ends                                 |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when you have its answer, or when the files look the way it asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## How long is it

How many words does each chapter have, and the whole book? One command can tell you both.

## Table of contents

Save the six titles, in order, to `contents.txt` in `novel`: only the titles, with no file names around them.

## Notes left behind

While she wrote, Serena marked what she still had to do with `[TODO: ...]`. Find every one, with its file and its line number, to send to her: she will write those parts herself.

## Double spaces

Two spaces one after the other look like a hole on a printed page. Find the lines that have them. Then change every group of spaces to a single space, in all six files at once, and check that no chapter has two spaces together any more.

## Too sudden

The editor says "Suddenly" is used far too often. In how many lines of each chapter is it? And how many times is it in the whole book? These are not the same question. Serena will rewrite most of them, so tell her which chapters have them.

## A new name

The editor wants the main character, Raj, to be called Pedro. Before you change anything, look at every word that starts with `Raj`, and how many times each one is there: not all of them are him.

Try the change on one chapter without changing the file, and see what can go wrong. Then change his name in all six files, and only his name.

A new idea: in a `sed` pattern, `\b` matches the edge of a word.

## The book

Put the six chapters together, in order, into `~/the-keeper.txt`. Count its lines and words: the double spaces were not words, and the new name is one word, like the old one. The book is ready for Serena's last reading.
