Your dad finally has a new phone, and his contacts came over in two exports: one from the old phone, one from the new phone's cloud account. Half of the people are in both, the same number written three different ways, and his friend Dan seems to have two numbers. He wants one clean list before he deletes the old phone's.

You do it one step at a time, in the terminal on the right. Each step writes a file the next one reads. Tick a step off once its file holds what the step asks; you can always come back and untick it.

The terminal starts fresh every time you open the page or press Reset, with only the two exports. Each step is a command or two, so redo the ones you had done.

## Look at both exports

You start in `~/contacts`. Count the lines of both files with one `wc -l`: 8 contacts in each. Then look at the first lines of each:

```text
Ana Pop,0722 111 222
Bogdan Ilie,0744 333 444
Clinic Dr. Matei,0264 555 666
```

```text
Mama,+40 721 000 111
Ana Pop,+40722111222
Dan Radu,0733 777 888
```

A name, a comma, a number. Ana is in both, once as `0722 111 222` and once as `+40722111222`: the same number, since `+40` is Romania's code and stands for the first `0`.

## All in one file

Put both files, one after the other, into `all.csv` with `cat` and `>`. It has 16 lines.

## One way of writing a number

Before you can spot duplicates, every number must be written the same way: no spaces, and `0` instead of `+40`.

`sed 's/ //g'` removes every space, the ones in the names too (`AnaPop`). Only the second field must change, and `awk` can do that: `gsub(" ", "", $2)` removes every space from field 2. With `-F,` it splits lines on commas, and `-v OFS=,` puts the commas back when it prints the line:

```bash
awk -F, -v OFS=, '{gsub(" ", "", $2); print}' all.csv
```

Pipe that into `sed 's/,+40/,0/'` and save the result as `same.csv`. Having the comma in the pattern means only a `+40` at the start of a number changes. Look at it: Ana is now `0722111222` in both lines.

## Everyone once

`sort` and `uniq -d` show the lines that are now exactly the same:

```text
Ana Pop,0722111222
Dan Radu,0733777888
Florin Toma,0755123456
Mama,0721000111
```

Save every line once, sorted by name, to `merged.csv` with `sort -u`. From 16 lines down to 12:

```text
Ana Pop,0722111222
Bogdan Ilie,0744333444
Clinic Dr. Matei,0264555666
Dan Radu,0733777888
Dan Radu,0799888777
Elena Stan,
Florin Toma,0755123456
Gabi Neagu,0766432100
Ioana Marin,0740202303
Mama,0721000111
Pizzeria Roma,0264999000
Plumber Vasile,0742600700
```

## Two numbers for one name

Some names still appear twice, with two different numbers. Cut out the names and let `uniq -d` show the repeats (the file is sorted, so the same names sit together):

```text
Dan Radu
```

`grep "^Dan Radu," merged.csv` shows both numbers. Your dad says Dan changed his number last year, and the new one is `0799888777`. Remove the old line with `grep -v`, writing the rest to `final.csv`. Use the whole line as the pattern, so nothing else can match. `final.csv` has 11 lines.

## Missing numbers

A line that ends right after its comma has no number: `grep ",$"` finds it (`$` is the end of the line).

```text
Elena Stan,
```

Elena's number never made it off the old phone; your dad will ask her for it again. Leave her in the list, so he remembers.

## Mobiles and landlines

Numbers starting with `07` are mobiles, the ones starting with `02` or `03` landlines. Count the mobiles in `final.csv` with `grep -c ",07"`: `8`. Then list the landlines, which he can't text:

```text
Clinic Dr. Matei,0264555666
Pizzeria Roma,0264999000
```

## Ready to import

The new phone imports a CSV file whose first line names its columns. Write `name,phone` to `contacts.csv` with `echo` and `>`, then add the 11 contacts of `final.csv` after it with `cat` and `>>`. `wc -l contacts.csv` prints `12`, and `head -3` shows:

```text
name,phone
Ana Pop,0722111222
Bogdan Ilie,0744333444
```
