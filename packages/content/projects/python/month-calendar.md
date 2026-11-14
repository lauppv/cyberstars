Grandma Lucia has a paper calendar on the kitchen wall, with every birthday in the family written on it by hand. The shop near her home doesn't sell them any more. So you will make her one: a program that prints the months she asks for, each one like a real calendar, with the family's birthdays, the public holidays, and how many working days her grandchildren have that month.

Don't use `import calendar` or `import datetime`: the point is to work out the dates yourself.

**The input** starts with the first month to print: the year, the month's number, and how many months to print. The next line says how many dates follow, then one date on each line: `B` for a birthday or `H` for a holiday, the day and the month, and a name, which can have spaces:

```text
2026 11 3
5
B 14.11 Mom
B 23.11 Ida
H 11.11 Armistice Day
H 25.12 Christmas
B 2.11 Granny Ida
```

**The output** for this input, when the program is finished:

```text
   November 2026
Mo Tu We Th Fr Sa Su
                   1
 2  3  4  5  6  7  8
 9 10 11 12 13 14 15
16 17 18 19 20 21 22
23 24 25 26 27 28 29
30
Birthdays: 2 Granny Ida, 14 Mom, 23 Ida
Holidays: 11 Armistice Day
Working days: 20

   December 2026
Mo Tu We Th Fr Sa Su
    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31
Birthdays: none
Holidays: 25 Christmas
Working days: 22

    January 2027
Mo Tu We Th Fr Sa Su
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
Birthdays: none
Holidays: none
Working days: 21
```

Some words you will meet:

| Word        | What it means                                     |
| ----------- | ------------------------------------------------- |
| leap year   | a year with a 29 February, so it has 366 days     |
| weekday     | Monday, Tuesday, and so on to Sunday              |
| working day | a day from Monday to Friday that is not a holiday |

**To try your program**, press Run, click in the output box and paste the input. The program knows how many lines to read, so it prints the calendar as soon as the last date is in.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests ask for other months, leap years too. Passing them finishes the project.

## What to print

Read the first line: the year, the month and how many months. Then read how many dates there are, and the dates.

A birthday comes every year, so a date has no year. The name can have spaces, like `Granny Ida`. `input().split(' ', 2)` cuts the line only at the first two spaces, so you get three parts: the letter, the date, and the whole name:

```python
kind, date, name = 'B 2.11 Granny Ida'.split(' ', 2)
# kind is 'B', date is '2.11', name is 'Granny Ida'
```

## How long is a month

Write two functions:

- `is_leap(year)` says if a year is a leap year. A year that divides by 4 is a leap year, but not one that divides by 100, unless it also divides by 400. So 2024 and 2000 are leap years, but 1900 and 2026 are not
- `days_in(year, month)` gives how many days a month has. April, June, September and November have 30, February has 28, or 29 in a leap year, and the others have 31

## What day is the 1st

1 January 1900 was a Monday. Count the days from that date to the 1st of your month: all the days of the years in between, then the days of the months before yours in its year. The remainder when you divide by 7 is the weekday:

```python
weekday = days % 7
```

0 is Monday, 1 is Tuesday, and so on up to 6, Sunday. For November 2026 you should get 6: it starts on a Sunday.

## The month on the wall

Print the month's name and the year in the middle of 20 characters (`center(20)`, then `rstrip()` to take off the spaces at the end). Then the days of the week. Then the days, one row for each week, from Monday to Sunday. Each day is right-aligned in 2 characters, with one space between days:

```text
   November 2026
Mo Tu We Th Fr Sa Su
                   1
 2  3  4  5  6  7  8
 9 10 11 12 13 14 15
16 17 18 19 20 21 22
23 24 25 26 27 28 29
30
```

The places before the 1st are two spaces each. Make a list of cells (the empty places first, then the days) and print it 7 at a time. Take the spaces off the end of each row.

## More than one month

Print the months one after the other, with an empty line between them. After December comes January of the next year.

## Birthdays and holidays

Under each month, list its birthdays and its holidays, each sorted by day. Write the day before the name, and put commas between them:

```text
Birthdays: 2 Granny Ida, 14 Mom, 23 Ida
Holidays: 11 Armistice Day
```

A month with no birthdays prints `Birthdays: none`, and one with no holidays prints `Holidays: none`. A birthday on 29 February shows only in leap years.

## Working days

Last, count the working days: the days from Monday to Friday, without the holidays on those days:

```text
Working days: 20
```

A holiday on a Saturday or a Sunday changes nothing, because that day was not a working day anyway. Grandma's calendar is on the wall again.
