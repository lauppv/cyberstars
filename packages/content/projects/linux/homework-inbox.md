Mrs. Dobre teaches programming to a class of six, and her students upload their homework to a shared folder: three assignments so far, each a Python file named after its student. Before she grades anything on Sunday, she wants to know what came in, what didn't, which uploads are broken and whether anyone copied. You'll find out for her.

You do it one step at a time, in the terminal on the right. Tick a step off once you get its answer, or its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## What came in

The uploads are in `~/inbox`, and the class list in `~/roster.txt`, one name per line. How many uploads are there? Every name looks like `ana_hw2.py`: the student, an underscore, the assignment. How many uploads came in for each assignment?

## Broken uploads

An upload that went wrong leaves an empty file. Save the list of empty files in `inbox` to `~/empty.txt`, as paths starting with `inbox/`: Mrs. Dobre will ask those students to upload again.

## Who is missing homework 3

Write the names of the students who sent homework 3 to `~/hw3-in.txt`, one per line, in alphabetical order, the name alone. Then save the students on the roster who are **not** in that file to `~/hw3-missing.txt`, without typing a single name.

Careful: a short name must not hide a longer one, so a student called `an` couldn't make `ana` look like she sent it.

## Who copied

Every file starts with a comment naming its author, like `# Author: Ana`. Look at the authors of every homework 2 file, each next to its file's name. One of them doesn't match the name on the file. Check that the two programs are really the same, line for line.

## Unfinished work

Students leave `# TODO` comments for what they didn't finish. How many are left in each homework 3 file?

Somebody also forgot a debugging line in their homework: `print("debug")`. Find it in every `.py` file, with its line number. Mind the quotes inside the pattern.

## Who wrote the most

How long is each homework 3 file? List them from the shortest. Shorter isn't worse: compare with the TODOs you counted.

## A folder per assignment

Grading is easier one assignment at a time. Inside `inbox`, make a folder for each assignment, `hw1`, `hw2` and `hw3`, and move every file into its assignment's folder. Nothing stays loose in `inbox`.

Last, write Mrs. Dobre a note, `~/notes.txt`, one finding per line, with what you found:

```text
Empty upload: <student> <assignment>
Missing hw3: <students, separated by a comma and a space>
Copied hw2: <who handed it in> (from <who wrote it>)
Debug print left: <student> <assignment>
```

Write the names in small letters, as the files do, and the assignments as `hw1`, `hw2` or `hw3`.
