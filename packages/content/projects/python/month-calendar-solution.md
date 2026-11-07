```python
NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
         'August', 'September', 'October', 'November', 'December']


def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


def days_in(year, month):
    if month == 2:
        return 29 if is_leap(year) else 28
    return 30 if month in (4, 6, 9, 11) else 31


def first_weekday(year, month):
    # 0 = Monday; 1 January 1900 was a Monday
    days = 0
    for y in range(1900, year):
        days += 366 if is_leap(y) else 365
    for m in range(1, month):
        days += days_in(year, m)
    return days % 7


year, month, count = [int(x) for x in input().split()]
events = []
for _ in range(int(input())):
    kind, date, name = input().split(' ', 2)
    day, mon = [int(x) for x in date.split('.')]
    events.append((kind, day, mon, name))

for i in range(count):
    if i:
        print()
    length = days_in(year, month)
    start = first_weekday(year, month)
    print(f'{NAMES[month - 1]} {year}'.center(20).rstrip())
    print('Mo Tu We Th Fr Sa Su')
    cells = ['  '] * start + [f'{d:>2}' for d in range(1, length + 1)]
    for row in range(0, len(cells), 7):
        print(' '.join(cells[row:row + 7]).rstrip())
    for kind, label in (('B', 'Birthdays'), ('H', 'Holidays')):
        found = sorted((d, n) for k, d, m, n in events if k == kind and m == month and d <= length)
        print(f'{label}: ' + (', '.join(f'{d} {n}' for d, n in found) if found else 'none'))
    holidays = {d for k, d, m, n in events if k == 'H' and m == month}
    working = sum(1 for d in range(1, length + 1) if (start + d - 1) % 7 < 5 and d not in holidays)
    print(f'Working days: {working}')
    month += 1
    if month == 13:
        month = 1
        year += 1
```
