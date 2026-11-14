Mrs. Price teaches programming to a class of six. Her students put their homework in a shared folder: three homeworks so far, each one a Python file with the student's name. Before she gives grades on Sunday, she wants to know what came in, what is missing, which files are broken, and if anyone copied. You will find out for her.

**What you start with.** The homework files are in `~/inbox`, and the list of the class is in `~/roster.txt`, one name on each line. Every file's name is like `ida_hw2.py`: the student, an underscore, then the homework.

**What you make.**

| File                | What it holds                                   |
| ------------------- | ----------------------------------------------- |
| `~/empty.txt`       | the empty homework files                        |
| `~/hw3-in.txt`      | the students who sent homework 3                |
| `~/hw3-missing.txt` | the students who didn't send homework 3         |
| `~/notes.txt`       | a short note for Mrs. Price with what you found |

And at the end, in `inbox`, one folder for each homework, with its files in it.

Some words you will meet:

| Word     | What it means                                                 |
| -------- | ------------------------------------------------------------- |
| upload   | a file a student sent                                         |
| roster   | the list of the students in the class                         |
| comment  | in Python, a line that starts with `#`: the computer skips it |
| `# TODO` | a comment students write for work they didn't finish          |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when you have its answer, or when its file holds what the step asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## What came in

How many files are in `inbox`? And how many came in for each homework?

## Broken uploads

When an upload goes wrong, it leaves an empty file. Save the list of the empty files in `inbox` to `~/empty.txt`, as paths that start with `inbox/`. Mrs. Price will ask those students to send their work again.

## Who is missing homework 3

Write the names of the students who sent homework 3 to `~/hw3-in.txt`: one on each line, only the name, in order from A to Z.

Then save the students of the roster who are **not** in that file to `~/hw3-missing.txt`, without typing any name yourself.

Be careful: a short name must not hide a longer one. A student called `ida` must not make it look like `aida` sent her homework.

## Who copied

Every file starts with a comment that names who wrote it, like `# Author: Ida`. Look at the author of every homework 2 file, next to the file's name. One of them is not the name on the file. Check that the two programs are really the same, line for line.

## Unfinished work

How many `# TODO` comments are in each homework 3 file?

Someone also forgot a line they used to find a bug: `print("debug")`. Find it in every `.py` file, with its line number. Be careful with the quotes inside the pattern.

## Who wrote the most

How many lines does each homework 3 file have? List them from the shortest. Shorter is not always worse: compare with the TODOs you counted.

## A folder per assignment

Grading is easier one homework at a time. Inside `inbox`, make a folder for each homework, `hw1`, `hw2` and `hw3`, and move every file into its homework's folder. Nothing stays loose in `inbox`.

Last, write Mrs. Price a note, `~/notes.txt`, with what you found, one thing on each line:

```text
Empty upload: <student> <assignment>
Missing hw3: <students, separated by a comma and a space>
Copied hw2: <who handed it in> (from <who wrote it>)
Debug print left: <student> <assignment>
```

Write the names in small letters, as the files do, and the homeworks as `hw1`, `hw2` or `hw3`.
