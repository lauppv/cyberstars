Your dad finally has a new phone, and his contacts came over in two exports: one from the old phone, one from the new phone's cloud account. Half of the people are in both, the same number written three different ways, and his friend Dan seems to have two numbers. He wants one clean list before he deletes the old phone's.

You do it one step at a time, in the terminal on the right. Each step writes a file the next one reads. Tick a step off once its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Look at both exports

You start in `~/contacts`. How many contacts does each file hold? Look at the first lines of both: a name, a comma, a number. You'll find the same person in both with the number written two ways. `+33` is France's code and stands in for the first `0`, so `+33722111222` and `07 22 11 12 22` are the same number.

## All in one file

Put both files, one after the other, into `all.csv`.

## One way of writing a number

Before you can spot duplicates, every number must be written the same way: no spaces, and `0` instead of `+33`. Only the numbers change: the spaces in the names stay. Save the result as `same.csv`, and check one of the people who was in both files.

New idea: `awk` can change a single field and print the line back with its commas. `-F,` splits on commas, `-v OFS=,` puts them back, and `gsub` replaces text inside one field only. For example, this writes every first field in capitals:

```bash
awk -F: -v OFS=: '{$1 = toupper($1); print}' pets.txt
```

## Everyone once

Which lines are now exactly the same? Save every line once, sorted by name, to `merged.csv`.

## Two numbers for one name

A name can still appear twice, with two different numbers. Find which name. Your dad says that person changed their number last year, and the new one is `0799888777`. Save `merged.csv` without the old line to `final.csv`, making sure nothing else can match what you remove.

## Missing numbers

Is there a contact with no number at all? Find it. That number never made it off the old phone, and your dad will ask for it again, so leave the contact in the list, so he remembers.

## Mobiles and landlines

Numbers starting with `07` are mobiles, the ones starting with `02` or `03` landlines. How many mobiles are in `final.csv`? And which contacts are landlines, the ones he can't text?

## Ready to import

The new phone imports a CSV file whose first line names its columns. Make `contacts.csv`: first the line `name,phone`, then every contact of `final.csv`.
