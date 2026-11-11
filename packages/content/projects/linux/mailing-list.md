The bookshop on the corner collects newsletter sign-ups on a tablet by the till. A year of them sits in one text file: some typed in capitals, some twice, a few that aren't email addresses at all, and two people who have since asked to be taken off. The owner wants to send the first newsletter on Friday, to a clean list.

You clean it one step at a time, in the terminal on the right. Each step reads the file the previous one wrote and writes a new one, so you can always look back at what changed. Tick a step off once its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Look at the sign-ups

You start in `~/newsletter`, next to `signups.txt` and `unsubscribed.txt`. How many lines does `signups.txt` have? Look at them with their line numbers: you'll spot some of the trouble straight away.

## Drop the empty lines

Someone pressed Enter without typing. Save every line that isn't empty to `step1.txt`.

New idea: in a `grep` pattern, `^` stands for the start of a line and `$` for its end, so a pattern can say what a whole line must look like.

## One way of writing

Email addresses don't care about capitals, but a list does: to `sort` and `uniq`, `Ida@Mail.com` and `ida@mail.com` are two different lines. Write every line of `step1.txt` in small letters to `step2.txt`, and check that no capital letter is left.

New idea: `awk` has a function that turns text into small letters, `tolower`.

## Everyone once

Now the duplicates show. Find which addresses appear more than once, then write every address once, sorted, to `step3.txt`.

## Real addresses only

A real address has an `@` with a dot somewhere after it. First look at the lines that **don't** look like that, to be sure you only throw away junk, then keep the good ones in `step4.txt`. Careful: in a pattern a plain `.` matches any character, not just a dot.

The owner will ask the people with a broken address to write it again next time they come in.

## Respect the unsubscribes

`unsubscribed.txt` holds the people who asked to be taken off. Save `list.txt`, the list the newsletter goes to: every line of `step4.txt` except theirs, still sorted. Don't type their addresses: let the file say who they are.

New idea: `grep` can read its patterns from a file, one per line. `grep --help` tells you which option does it.

## Who reads it

The owner also wants to know where the readers are. Count the addresses on `list.txt` per domain, the part after the `@`, from the most common.

The local school will get a poster too, so put the addresses on `list.txt` that end in `@school.org` into `school.txt`. Make sure an address like `someone@school.org.example.com` wouldn't slip in.

## Tidy up

The four `step` files were only scaffolding. Remove them with one command. The newsletter folder now holds the two files you were given, `list.txt` and `school.txt`, and nothing else.
