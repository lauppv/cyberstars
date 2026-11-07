Sorina has finished the first draft of her short novel, The Keeper: six chapters, one text file each. Her editor sent back a list before it goes to print: a table of contents, the notes she left for herself found and dealt with, stray double spaces gone, fewer "Suddenly"s, and the main character renamed. Sorina writes beautifully but hates fiddly edits. You'll make them in the terminal.

You do it one step at a time, in the terminal on the right. Tick a step off once you get its answer, or the files look like it asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## How long is it

You start in `~/novel`, next to `chapter-01.txt` to `chapter-06.txt`. How many words does each chapter have, and the whole book? One command can tell you both.

## Table of contents

Each chapter's first line is its title. Save the six titles, in order, to `contents.txt`, the titles alone, with no file names around them.

## Notes left behind

While writing, Sorina marked what she still had to do with `[TODO: ...]`. Find every one, with its file and line number, to send her: she'll write those parts herself.

## Double spaces

Two spaces in a row look like a hole on a printed page. Find the lines that have them. Then replace every run of spaces with a single one, in all six files at once, and check that no chapter has two spaces in a row any more.

## Too sudden

The editor says "Suddenly" happens far too often. In how many lines of each chapter does it appear? And how many times in the whole book? Those two counts aren't the same question. Sorina will rewrite most of them; tell her which chapters.

## A new name

The editor wants the main character, Ion, renamed to Petru. Before you change anything, see every word that starts with `Ion`, and how many times each appears: not every one of them is him. Try the replacement on one chapter without changing it, and see what can go wrong. Then rename him in all six files, and only him.

New idea: in a `sed` pattern, `\b` matches the edge of a word.

## The book

Put the six chapters together, in order, into `~/the-keeper.txt`. Count its lines and words: the double spaces were not words, and the new name is one word like the old. The book is ready for Sorina's last pass.
