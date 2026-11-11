Grandma Lucia keeps a paper calendar on the kitchen wall, with every birthday in the family written in by hand. The shop near her block stopped selling them. You'll make her one instead: a program that prints the months she asks for, each one laid out like a real calendar, with the family's birthdays, the public holidays, and how many working days her grandchildren have that month.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests ask your program for months it has never printed, leap years included. Passing them finishes the project.

Don't import `calendar` or `datetime`: working out the dates yourself is the whole point.

## What to print

The first line says which month to start with, the year and the month's number, and how many months to print. The second line is how many dates follow, then one per line: `B` for a birthday or `H` for a holiday, the day and month, and a name that may have spaces:

```text
2026 11 3
5
B 14.11 Mom
B 23.11 Ida
H 30.11 Saint Andrew
H 1.12 National Day
B 2.11 Granny Ida
```

A birthday comes back every year, so a date has no year. `input().split(' ', 2)` splits off the first two words and keeps the rest of the line, spaces and all, as the third.

## How long is a month

Write two functions. `is_leap(year)` tells whether a year has a 29 February: a year that divides by 4 does, except one that divides by 100, unless it also divides by 400. So 2024 and 2000 do, 1900 and 2026 don't. `days_in(year, month)` gives the month's length: April, June, September and November have 30 days, February 28 or 29, the rest 31.

## What day is the 1st

1 January 1900 was a Monday. Count the days from then to the 1st of your month (every year in between, then every month before yours in its year) and the remainder of dividing by 7 says the weekday: 0 is Monday, 1 Tuesday, and so on up to 6, Sunday.

```python
days % 7
```

Grandma's November 2026 starts on 6: a Sunday.

## The month on the wall

Print the month's name and year centred in 20 characters (`center(20)`, then `rstrip()` to drop the spaces at the end), the days of the week, and the days themselves, a row per week starting on Monday, each day right-aligned in 2 characters with a space between them:

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

The days before the 1st are blanks of two spaces. Building a list of cells (blanks first, then the days) and printing it 7 at a time, each row with its trailing spaces taken off, does the whole grid.

## More than one month

Print the months one after another, with an empty line between them. After December comes January of the next year.

## Birthdays and holidays

Under each month's grid, list its birthdays and its holidays, each sorted by day, with the day in front of the name and commas between them:

```text
Birthdays: 2 Granny Ida, 14 Mom, 23 Ida
Holidays: 30 Saint Andrew
```

A month with none says `Birthdays: none` or `Holidays: none`. A 29 February birthday shows only in years that have one.

## Working days

Last, count the working days: Monday to Friday, without the holidays that fall on them.

```text
Working days: 20
```

A holiday on a Saturday or Sunday changes nothing, since that day wasn't a working one anyway. Grandma's calendar is on the wall again.
