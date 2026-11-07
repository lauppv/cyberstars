Sorina has finished the first draft of her short novel, The Keeper: six chapters, one text file each. Her editor sent back a list before it goes to print: a table of contents, the notes she left for herself found and dealt with, stray double spaces gone, fewer "Suddenly"s, and the main character renamed. Sorina writes beautifully but hates fiddly edits. You'll make them in the terminal.

You do it one step at a time, in the terminal on the right. Tick a step off once you get its answer, or the files look like it asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## How long is it

You start in `~/novel`, next to `chapter-01.txt` to `chapter-06.txt`. `wc -w` counts the words of each file, and adds them up when it gets several:

```text
  58 chapter-01.txt
  43 chapter-02.txt
  56 chapter-03.txt
  55 chapter-04.txt
  43 chapter-05.txt
  38 chapter-06.txt
 293 total
```

A wildcard such as `chapter-*.txt` hands the files over in order, since their numbers have the same two digits.

## Table of contents

Each chapter's first line is its title. `head -n 1` with several files prints the first line of each, under a header naming the file; `-q` leaves the headers out. Save the titles to `contents.txt`:

```text
Chapter 1: The Lighthouse
Chapter 2: The Harbour
Chapter 3: The Storm
Chapter 4: The Rescue
Chapter 5: The Morning After
Chapter 6: The Keeper
```

## Notes left behind

While writing, Sorina marked what she still had to do with `[TODO: ...]`. Find every one, with the file and line number:

```text
chapter-01.txt:7:[TODO: describe the sea here]
chapter-03.txt:7:[TODO: name the boat]
chapter-06.txt:6:[TODO: last line]
```

Send her the three lines; she'll write those parts herself.

## Double spaces

Two spaces in a row look like a hole on a printed page. Find the lines that have them, searching for two spaces between quotes:

```text
chapter-01.txt:6:He read it twice, then folded it  and put it in his coat.
chapter-03.txt:6:Out at sea, a small boat was turning back towards the  rocks.
```

Replace every run of spaces with a single one, in all six files at once, with `sed -i`. The pattern `  *` is a space followed by any number of spaces (`*` repeats the character before it). Then count the lines with two spaces in each file again: `0` everywhere.

## Too sudden

The editor says "Suddenly" happens far too often. Count the lines that have it in each chapter with `grep -c`:

```text
chapter-01.txt:1
chapter-02.txt:1
chapter-03.txt:1
chapter-04.txt:1
chapter-05.txt:0
chapter-06.txt:1
```

`grep -c` counts lines, not words. `grep -o` prints each match on a line of its own, so piping it into `wc -l` counts the words: `5` in the book. Sorina will rewrite four of them; tell her which chapters.

## A new name

The editor wants the main character, Ion, renamed to Petru. Before you change anything, see every word that starts with `Ion`: `grep -oh "Ion[a-z]*"` prints each one (`-h` leaves the file names out), and `sort | uniq -c` counts them:

```text
      8 Ion
      3 Ionescu
```

Mrs. Ionescu is someone else. Try the plain replacement on one chapter without `-i`, and see what goes wrong:

```text
Petru walked past the fish market, where Mrs. Petruescu was already shouting.
```

`\b` in a `sed` pattern matches only at the edge of a word, so `\bIon\b` matches Ion and never the start of Ionescu. Make the change in all six files with `-i`. Then the same `grep -oh` shows only `3 Ionescu`, and `grep -c Petru` finds him in every chapter.

## The book

Put the six chapters together, in order, into `~/the-keeper.txt` with `cat` and `>`. Count its lines and words with one `wc`:

```text
  37  293 ../the-keeper.txt
```

The same 293 words as at the start: the double spaces were not words, and the new name is one word like the old. `grep -c "^Chapter"` counts the six chapter titles, each at the start of a line. The book is ready for Sorina's last pass.
