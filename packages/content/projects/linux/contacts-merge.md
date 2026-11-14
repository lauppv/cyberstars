Your dad finally has a new phone, and his contacts came over in two files: one from the old phone, and one from the new phone's online account. Half of the people are in both files, with the same number written in different ways, and his friend Dan seems to have two numbers. He wants one clean list before he deletes the old phone's list.

**What you start with.** Two files in `~/contacts`: `old-phone.csv` and `new-phone.csv`. Each line is one contact: a name, a comma, a phone number.

**What you make.** Each step writes a file, and the next step reads it:

| File           | What it holds                                                              |
| -------------- | -------------------------------------------------------------------------- |
| `all.csv`      | both lists, one after the other                                            |
| `same.csv`     | the same lines, with every number written the same way                     |
| `merged.csv`   | every line only once, sorted by name                                       |
| `final.csv`    | the list without the old number of the person who changed it               |
| `contacts.csv` | the list ready for the new phone, with a first line that names the columns |

Some words you will meet:

| Word      | What it means                                                                      |
| --------- | ---------------------------------------------------------------------------------- |
| CSV file  | a text file where commas separate the values on each line                          |
| field     | one value of a line: here the name is field 1 and the number field 2               |
| duplicate | a line that is there twice                                                         |
| mobile    | a phone you can send messages to. Here its number starts with `07`                 |
| landline  | a phone at home or at work, with a cable. Here its number starts with `02` or `03` |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when its file holds what the step asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Look at both exports

How many contacts does each file have? Look at the first lines of both.

You will find the same person in both files, with the number written in two ways. `+33` is the code for France, and it takes the place of the first `0`. So `+33722111222` and `07 22 11 12 22` are the same number.

## All in one file

Put both files, one after the other, into `all.csv`.

## One way of writing a number

To find duplicates, every number must be written the same way: no spaces, and `0` in place of `+33`. Only the numbers change: the spaces in the names stay. Save the result as `same.csv`, and check one of the people who were in both files.

A new idea: `awk` can change only one field and print the line back with its commas. `-F,` cuts the line at the commas, `-v OFS=,` puts them back, and `gsub` changes text inside one field only. For example, this writes every first field in capital letters, in a file where `:` separates the fields:

```bash
awk -F: -v OFS=: '{$1 = toupper($1); print}' pets.txt
```

## Everyone once

Which lines are now exactly the same? Save every line only once, sorted by name, to `merged.csv`.

## Two numbers for one name

A name can still be there twice, with two different numbers. Find which name. Your dad says that this person changed their number last year, and the new one is `0799888777`.

Save `merged.csv` without the line with the old number to `final.csv`. Make sure that what you take out can't match any other line.

## Missing numbers

Is there a contact with no number at all? Find it. That number never left the old phone, and your dad will ask for it again. So leave this contact in the list, to remind him.

## Mobiles and landlines

How many mobiles are in `final.csv`? And which contacts are landlines, the ones he can't send a message to?

## Ready to import

The new phone takes a CSV file whose first line names its columns. Make `contacts.csv`: first the line `name,phone`, then every contact of `final.csv`.
