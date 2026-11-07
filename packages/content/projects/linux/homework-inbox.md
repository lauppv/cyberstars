Mrs. Dobre teaches programming to a class of six, and her students upload their homework to a shared folder: three assignments so far, each a Python file named after its student. Before she grades anything on Sunday, she wants to know what came in, what didn't, which uploads are broken and whether anyone copied. You'll find out for her.

You do it one step at a time, in the terminal on the right. Tick a step off once you get its answer, or its file holds what the step asks; you can always come back and untick it.

The terminal starts fresh every time you open the page or press Reset, with the uploads back in one folder. Each step is a command or two, so redo the ones you had done.

## What came in

The uploads are in `~/inbox`, and the class list in `~/roster.txt`, one name per line. Count the uploads: 15.

Every name looks like `ana_hw2.py`: the student, an underscore, the assignment. Cut each name at the underscore (`cut -d_ -f2`) and count the uploads per assignment:

```text
      6 hw1.py
      5 hw2.py
      4 hw3.py
```

## Broken uploads

An upload that went wrong leaves an empty file. `find` with `-empty` finds them:

```text
inbox/bogdan_hw1.py
```

Save that list to `~/empty.txt`; Mrs. Dobre will ask Bogdan to upload again.

## Who is missing homework 3

Write the names of the students who sent `hw3` to `~/hw3-in.txt`, one per line: list the inbox, keep the lines with `_hw3`, and cut out the first field.

```text
ana
dana
filip
ioana
```

Now the roster's names that aren't in that file: `grep -v -f hw3-in.txt roster.txt` drops every roster line matching a name from the file. Add `-x`, so a pattern only matches a whole line (without it, a student called `an` would hide `ana`). Save the result as `~/hw3-missing.txt`:

```text
bogdan
vlad
```

## Who copied

Every file starts with a comment naming its author, like `# Author: Ana`. Go into `inbox` and print that line from every `hw2` file; with several files, `grep` puts the file's name in front of each line:

```text
ana_hw2.py:# Author: Ana
bogdan_hw2.py:# Author: Bogdan
dana_hw2.py:# Author: Dana
ioana_hw2.py:# Author: Ioana
vlad_hw2.py:# Author: Ioana
```

Vlad's homework says Ioana wrote it. Print both files with `cat` and they are the same program, line for line. Mrs. Dobre will have a word with Vlad.

## Unfinished work

Students leave `# TODO` comments for what they didn't finish. Count them in every `hw3` file with `grep -c`:

```text
ana_hw3.py:0
dana_hw3.py:1
filip_hw3.py:2
ioana_hw3.py:1
```

Then look for a debugging line someone forgot in their homework: search every `.py` file for `print("debug")`, with line numbers. Mind the quotes: put the pattern in single quotes, so the double quotes inside reach `grep` as they are.

```text
dana_hw3.py:9:print("debug")
```

## Who wrote the most

Count the lines of every `hw3` file with `wc -l` and sort them from the shortest:

```text
  7 ana_hw3.py
  8 ioana_hw3.py
  9 dana_hw3.py
  9 filip_hw3.py
 33 total
```

Shorter isn't worse: Ana's is the only one with no TODO left.

## A folder per assignment

Grading is easier one assignment at a time. Inside `inbox`, make the folders `hw1`, `hw2` and `hw3`, and move every file into its assignment's folder, with a wildcard each. `ls` then shows only the three folders, and `ls hw2` the five uploads of homework 2.

Last, write Mrs. Dobre a note, `~/notes.txt`, with `echo` and `>>`, one finding per line:

```text
Empty upload: bogdan hw1
Missing hw3: bogdan, vlad
Copied hw2: vlad (from ioana)
Debug print left: dana hw3
```
