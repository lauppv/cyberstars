Dates are harder than they look: months have 28 to 31 days, some years have a 29th of February, and weeks don't fit into months. The module `datetime` knows all of this, so we don't have to

---

`date(year, month, day)` makes a date. We can read its parts, and print it

```py
from datetime import date

launch = date(2031, 5, 14)
print(launch)
print(launch.year, launch.month, launch.day)
```

Output

```text
2031-05-14
2031 5 14
```

Dates often come as text in this year-month-day form. `date.fromisoformat()` reads such text into a date: `date.fromisoformat("2031-05-14")`

---

`timedelta` is an amount of time, like 5 days. Adding it to a date moves the date, across months and years too. Taking one date away from another gives a `timedelta`, and its `.days` is the number of days between them

```py
from datetime import date, timedelta

d = date.fromisoformat("2031-12-30")
print(d + timedelta(days=5))
print((date(2032, 1, 1) - date(2031, 5, 14)).days)
```

Output

```text
2032-01-04
232
```

---

`.strftime()` writes a date the way we want. Codes with `%` stand for its parts: `%A` the day of the week, `%d` the day with two digits, `%B` the month's name, `%Y` the year. Anything else is copied as it is

```py
from datetime import date

launch = date(2031, 5, 14)
print(launch.strftime("%A %d %B %Y"))
print(launch.strftime("%d/%m/%Y"))
```

Output

```text
Wednesday 14 May 2031
14/05/2031
```

`.weekday()` gives the day of the week as a number: 0 for Monday up to 6 for Sunday. So `launch.weekday() >= 5` tells us if a date is on a weekend

---

`date.today()` gives today's date, and `datetime.now()` the date and the time right now. They are useful, but they change every day, so a program that prints them gives a different answer each time. To test a program, give it fixed dates instead

```py
from datetime import date

print(date.today().year >= 2026)
```

Output

```text
True
```

---

## Mission: Mission Calendar

Every trip from the station has a launch date and a length in days. The crew wants the dates written out in full, and to know if they come back on a weekend

1. Start your program with two variables: **launch**, a string with a date like `"2031-05-14"`, and **days**, a whole number. For example `launch = "2031-05-14"` and `days = 10`
2. Print `Launch: ` and the launch date as the day of the week, the day with two digits, the month's name and the year, like `Wednesday 14 May 2031`
3. Print `Return: ` and the date `days` days after the launch, written the same way
4. Print `Weekend: ` and `yes` if the return is on a Saturday or a Sunday, or `no`
5. Print `To new year: ` and how many days there are from the launch to the 1st of January of the next year

**launch** is a real date from the year 2000 to 2099, and **days** is from 0 to 1000

**Example** for launch = "2031-05-14" and days = 10

```text
Launch: Wednesday 14 May 2031
Return: Saturday 24 May 2031
Weekend: yes
To new year: 232
```
