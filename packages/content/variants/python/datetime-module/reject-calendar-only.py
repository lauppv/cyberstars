import calendar

launch = "2031-05-14"
days = 10


def add_days(year, month, day, n):
    for _ in range(n):
        day += 1
        if day > calendar.monthrange(year, month)[1]:
            day = 1
            month += 1
            if month > 12:
                month = 1
                year += 1
    return year, month, day


def show(year, month, day):
    name = calendar.day_name[calendar.weekday(year, month, day)]
    return f"{name} {day:02d} {calendar.month_name[month]} {year}"


year, month, day = [int(part) for part in launch.split("-")]
back = add_days(year, month, day, days)
left = 0
y, m, d = year, month, day
while y == year:
    y, m, d = add_days(y, m, d, 1)
    left += 1

print(f"Launch: {show(year, month, day)}")
print(f"Return: {show(*back)}")
print(f"Weekend: {'yes' if calendar.weekday(*back) >= 5 else 'no'}")
print(f"To new year: {left}")
