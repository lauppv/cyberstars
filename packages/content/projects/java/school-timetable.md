Every September the deputy head of a small high school builds the timetable on a huge sheet of paper, and every September some teacher turns out to be in two rooms at once, or a class of 28 gets sent to a lab with 16 seats. You'll write the program that builds the timetable with her: it refuses every lesson that breaks a rule, prints each class's week as a grid, and finds a free room when she needs one.

You build it one step at a time, in one `Main.java`. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`. Run it, then type the lines of an example yourself to see what it answers.

## The school

The program starts by reading the school in three blocks, each a count and then its lines: the rooms with their seats, the teachers with the subjects they teach, and the classes with their number of students:

```text
3
R1 30
R2 24
Lab 16
3
Popa math physics
Ionescu english
Marin math chemistry
2
9A 28
9B 16
```

Keep each in a map by name; a teacher's subjects fit a `Set`. Print `3 rooms, 3 teachers, 2 classes`, then keep reading commands until someone types `quit`, and print `Bye` then. Any other word prints `Unknown command: plan`.

## A lesson in the timetable

The week has five days, an `enum` `MON` to `FRI`, typed in any case and printed as `Mon`, `Tue` and so on, and six periods a day, numbered 1 to 6. A lesson is a class, a subject, a teacher, a room, a day and a period; nothing about it changes, so make it a `record` and keep the timetable as a list of them.

`add <class> <subject> <teacher> <room> <day> <period>` puts a lesson in:

```text
add 9A math Popa R1 mon 1
9A: math with Popa in R1, Mon period 1
```

Refuse it, and add nothing, when the day isn't one of the five (`Days are mon, tue, wed, thu and fri`), the period isn't 1 to 6 (`Periods go from 1 to 6`), or the class, the teacher or the room doesn't exist (`No class 9C`, `No teacher Pavel`, `No room Gym`), checked in that order.

## Teachers and rooms that fit

Two more rules, checked after those:

- the teacher must teach that subject: `Popa doesn't teach english`
- the room must have a seat for every student: `Lab has 16 seats, 9A has 28 students`

## No one in two places

The rules the paper sheet kept breaking. At the same day and period:

- a class can have only one lesson: `9A already has math then`
- a teacher can teach only one class: `Popa is teaching 9A then`
- a room can hold only one class: `R1 is taken by 9A then`

Check them in that order, after the rules before. A small method that finds the lesson at a given day and period matching some condition (a class, a teacher or a room) serves all three; a lambda passed as a `Predicate<Lesson>` describes the condition.

## The week as a grid

`timetable <class>` prints a class's week: a header with the days, then one row per period with the subject of each day's lesson, or `-`. Every cell is padded to 9 characters with a space before it (`String.format(" %-9s", ...)`), and each line has its trailing spaces trimmed (`stripTrailing()`):

```text
timetable 9A
   Mon       Tue       Wed       Thu       Fri
1  math      english   -         -         -
2  physics   -         -         -         -
3  math      -         -         -         -
4  -         -         -         -         -
5  -         -         -         -         -
6  -         -         -         -         -
```

## A free room, and taking lessons out

- `free <day> <period>` lists the rooms nobody uses then, smallest first (then by name), `R2 (24 seats)`, or `No room free`
- `remove <class> <day> <period>` takes a class's lesson out, `Removed math for 9A, Mon period 3`, or prints `9A has nothing then`

## Fair days

Two last rules, so nobody's day is too heavy:

- a teacher teaches at most 4 periods a day: `Popa already teaches 4 periods on Mon`
- a class has at most 2 periods of the same subject a day: `9A already has 2 periods of math on Mon`

Check them after all the others.

## Teachers' week and the load

- `teacher <name>` lists a teacher's lessons in order of day and period, `Mon 1: math, 9A, R1`, or `Popa has no lessons`
- `load` shows every teacher's periods for the week, the most first (ties by name), then every class's, in the order they came

```text
load
Popa: 4 periods
Ionescu: 1 period
Marin: 1 period
9A: 3 periods
9B: 3 periods
```

Finally, check that the program never stops with an exception: commands with the wrong number of words print their usage line (`Usage: add <class> <subject> <teacher> <room> <day> <period>`, `Usage: remove <class> <day> <period>`, `Usage: timetable <class>`, `Usage: free <day> <period>`, `Usage: teacher <name>`), and a period that isn't a number prints `Not a number: one`.
