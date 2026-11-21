from datetime import date, timedelta

launch = "2031-05-14"
days = 10
start = date.fromisoformat(launch)
back = start + timedelta(days=days)
print(f"Launch: {start:%A %d %B %Y}")
print(f"Return: {back:%A %d %B %Y}")
print("Weekend: " + ("yes" if back.isoweekday() > 5 else "no"))
year_days = (date(start.year, 12, 31) - date(start.year, 1, 1)).days + 1
print(f"To new year: {year_days - start.timetuple().tm_yday + 1}")
