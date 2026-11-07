The bookshop on the corner collects newsletter sign-ups on a tablet by the till. A year of them sits in one text file: some typed in capitals, some twice, a few that aren't email addresses at all, and two people who have since asked to be taken off. The owner wants to send the first newsletter on Friday, to a clean list.

You clean it one step at a time, in the terminal on the right. Each step reads the file the previous one wrote and writes a new one, so you can always look back at what changed. Tick a step off once its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Look at the sign-ups

You start in `~/newsletter`, next to `signups.txt` and `unsubscribed.txt`. Count the lines of `signups.txt`: 21. Then look at them with line numbers, `cat -n`, and you'll spot the trouble already:

```text
     1	ana.pop@gmail.com
     2	Mihai.Ionescu@Yahoo.com
     3	ioana@school.ro
     4
     5	dan.radu@gmail.com
     6	ANA.POP@GMAIL.COM
```

Line 4 is empty, and lines 1 and 6 are the same person.

## Drop the empty lines

Someone pressed Enter without typing. Keep every line that isn't empty in `step1.txt`: `grep -v` keeps the lines that **don't** match, and `^$` matches a line with nothing between its start and its end.

```text
19 step1.txt
```

## One way of writing

Email addresses don't care about capitals, but a list does: `ANA.POP@GMAIL.COM` and `ana.pop@gmail.com` look different to `sort` and `uniq`. Write every line in small letters to `step2.txt` with `awk`, which has a `tolower` function:

```bash
awk '{print tolower($0)}' step1.txt > step2.txt
```

`$0` is the whole line. Check that no capital is left: `grep -c '[A-Z]' step2.txt` counts the lines with one, and prints `0`.

## Everyone once

Now the duplicates show. `sort` then `uniq -d` lists the lines that appear more than once:

```text
ana.pop@gmail.com
ioana@school.ro
paul.dinu@yahoo.com
```

Write every address once, sorted, to `step3.txt`. `sort -u` sorts and drops repeats in one go:

```text
16 step3.txt
```

## Real addresses only

A real address has an `@` with a dot somewhere after it. First look at the lines that **don't** look like that, to be sure you only throw away junk:

```text
not-an-email
vlad@gmail
```

`vlad@gmail` is missing its `.com`; the owner will ask Vlad next time he comes in. Then keep the good lines in `step4.txt`. The pattern `@.*\.` means an `@`, anything, then a real dot (a plain `.` would match any character):

```text
14 step4.txt
```

## Respect the unsubscribes

`unsubscribed.txt` holds the two people who asked to be taken off. `grep -f` reads its patterns from a file, one per line, so `grep -v -f unsubscribed.txt step4.txt` keeps every line that matches none of them. Save the result as `list.txt`, the list the newsletter goes to:

```text
ana.pop@gmail.com
cristina.m@gmail.com
diana.neagu@gmail.com
elena.stan@outlook.com
george.tudor@gmail.com
ioana@school.ro
irina.dobre@gmail.com
maria.lupu@yahoo.com
mihai.ionescu@yahoo.com
paul.dinu@yahoo.com
radu.vasile@outlook.com
sorin.pana@school.ro
```

From 21 lines to 12 people.

## Who reads it

The owner also wants to know where the readers are. Count the addresses per domain, the part after the `@` (`cut` with `-d@`), from the most common:

```text
      5 gmail.com
      3 yahoo.com
      2 school.ro
      2 outlook.com
```

The local school will get a poster too, so put the `school.ro` addresses in `school.txt`. Anchor the pattern to the end of the line with `$`, so an address like `someone@school.ro.example.com` wouldn't slip in.

## Tidy up

The four `step` files were only scaffolding. Remove them with one `rm`, and `ls` shows what the owner gets:

```text
list.txt
school.txt
signups.txt
unsubscribed.txt
```
