from datetime import date, timedelta

launch = "2031-05-14"
days = 10
start = date.fromisoformat(launch)
back = start + timedelta(days=days)
print(f"Launch: {start.strftime('%A %d %B %Y')}")
print(f"Return: {back.strftime('%A %d %B %Y')}")
print(f"Weekend: {'yes' if back.weekday() >= 5 else 'no'}")
print(f"To new year: {(date(start.year, 12, 31) - start).days}")
