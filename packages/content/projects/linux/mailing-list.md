The bookshop on the corner asks its customers to sign up for a newsletter, on a tablet next to the till. A year of sign-ups is in one text file. Some are typed in capital letters, some are there twice, a few are not email addresses at all, and two people have asked to be taken off the list. The owner wants to send the first newsletter on Friday, to a clean list.

**What you start with.** Two files in `~/newsletter`: `signups.txt`, one address on each line, and `unsubscribed.txt`, the people who asked to be taken off.

**What you make.** Each step reads the file the step before it wrote, and writes a new one, so you can always look back at what changed:

| File         | What it holds                     |
| ------------ | --------------------------------- |
| `step1.txt`  | the sign-ups without empty lines  |
| `step2.txt`  | the same, in small letters        |
| `step3.txt`  | every address once, sorted        |
| `step4.txt`  | only the real addresses           |
| `list.txt`   | the list the newsletter goes to   |
| `school.txt` | the addresses of the local school |

At the end, the four `step` files go away: only the two files you got, `list.txt` and `school.txt` are left.

Some words you will meet:

| Word        | What it means                                                         |
| ----------- | --------------------------------------------------------------------- |
| sign-up     | one person who gave their address for the newsletter                  |
| unsubscribe | ask to be taken off a list                                            |
| domain      | the part of an address after the `@`, like `mail.com`                 |
| pattern     | a short text that says what lines to find, like the ones `grep` takes |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when its file holds what the step asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Look at the sign-ups

How many lines does `signups.txt` have? Look at them with their line numbers: you will see some of the problems at once.

## Drop the empty lines

Someone pressed Enter without typing anything. Save every line that is not empty to `step1.txt`.

A new idea: in a `grep` pattern, `^` means the start of a line and `$` its end, so a pattern can say what a whole line must look like.

## One way of writing

Email addresses don't care about capital letters, but a list does: for `sort` and `uniq`, `Ida@Mail.com` and `ida@mail.com` are two different lines. Write every line of `step1.txt` in small letters to `step2.txt`, and check that no capital letter is left.

A new idea: `awk` has a function that turns text into small letters, `tolower`.

## Everyone once

Now you can see the addresses that are there twice. Find which addresses come more than once. Then write every address once, sorted, to `step3.txt`.

## Real addresses only

A real address has an `@`, and a dot somewhere after it. First look at the lines that **don't** look like that, to be sure you throw away only junk. Then keep the good ones in `step4.txt`.

Be careful: in a pattern, a plain `.` matches any character, not only a dot.

The owner will ask the people with a broken address to write it again next time they come in.

## Take off who asked

Save `list.txt`, the list the newsletter goes to: every line of `step4.txt` except the people in `unsubscribed.txt`, still sorted. Don't type their addresses: let the file say who they are.

A new idea: `grep` can read its patterns from a file, one on each line. `grep --help` tells you which option does it.

## Who reads it

The owner also wants to know where the readers are. Count the addresses in `list.txt` for each domain, the most common first.

The local school will get a poster too, so put the addresses of `list.txt` that end in `@school.org` into `school.txt`. Make sure that an address like `someone@school.org.example.com` can't get in.

## Tidy up

The four `step` files were only there to help. Remove them with one command. Now the `newsletter` folder holds the two files you got, `list.txt` and `school.txt`, and nothing else.
