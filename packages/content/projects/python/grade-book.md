Mr. Pavel teaches a small evening class and keeps his grades on the back of an envelope. At the end of term he needs averages, a ranking and a list of who passes, and the envelope is full. You'll write him a grade book he types into.

You build it one step at a time, in one file. Every step adds a command, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## The class list

The program starts by reading the class: the first line is how many students there are, then one name per line.

```text
4
Ana
Bogdan
Dan
Irina
```

Print `Class of 4` (with the real number). Then keep reading commands, one per line, until Mr. Pavel types `quit`, and print `Goodbye` then. For now every other command can be ignored.

Each student will get grades in several subjects, so think about how you'll keep them: a dictionary with a name for each student, holding something for each of their subjects, works well.

## Record a grade

`grade <name> <subject> <score>` records one grade. Grades are whole numbers from 1 to 10, and a student can get several in the same subject.

```text
grade Ana math 9
Recorded 9 for Ana in math
grade Ana math 7
Recorded 7 for Ana in math
```

Refuse the grade, and record nothing, when:

- the name isn't in the class: `No student named Mara`
- the score is below 1 or above 10: `Grades go from 1 to 10`

Check them in that order.

## A student's average

`average <name>` prints the average of all of a student's grades, every subject together, with two decimals, and how many grades it is over:

```text
average Ana
Ana: 8.50 average over 4 grades
```

A single grade reads `over 1 grade`. A student with no grades yet prints `Bogdan has no grades yet`, and a name not in the class the same `No student named Mara` as before.

## One subject

`subject <subject>` shows everyone's grades in one subject, students sorted by name, the grades in the order they were given:

```text
subject math
Ana: 9, 7
Dan: 4, 3
Irina: 9
```

Students without a grade in it aren't listed. When nobody has one, print `No grades in art`.

## The ranking

`top` ranks the students by their average, highest first, numbered from 1. Two with the same average go by name. Students with no grades can't be ranked, so they come last, on one line, sorted by name:

```text
top
1. Irina 8.67
2. Ana 8.50
3. Dan 4.33
No grades: Bogdan
```

Leave the last line out when everyone has grades.

## Fix a mistake

Mr. Pavel sometimes writes a grade wrong. `fix <name> <subject> <old> <new>` replaces one grade with another:

```text
fix Dan math 4 8
Changed Dan's math grade from 4 to 8
```

When the student has two equal grades in the subject, change only the first. When they have no such grade, print `Dan has no 2 in math` and change nothing; an unknown name prints `No student named Mara`, and a new grade outside 1 to 10 `Grades go from 1 to 10`.

## End of term

`report` decides who passes. A student passes when every subject they have grades in averages at least 5; their overall average doesn't decide it alone. One line per student, sorted by name:

```text
report
Ana: 8.50, passes
Bogdan: no grades
Dan: 4.33, fails math
Irina: 8.67, passes
Passing: 2 of 4
```

A student failing several subjects lists them all, sorted and separated by commas: `fails history, math`. The last line counts those who pass out of the whole class; a student with no grades doesn't pass.

Run `fix Dan math 4 8` and `report` again: Dan's math averages 5.50 now, and he passes.

## Survive bad input

Mr. Pavel types fast. Your program must never stop with an error, whatever he types:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: grde`
- a known command with the wrong number of words prints how to use it: `Usage: grade <name> <subject> <score>`, `Usage: average <name>`, `Usage: subject <subject>`, `Usage: fix <name> <subject> <old> <new>`, and `Usage: top` or `Usage: report` when words follow them
- a score that isn't a whole number prints the same usage line as a wrong number of words

Use `try` / `except` around the conversion rather than checking the characters yourself.
