import datetime

launch = "2031-05-14"
days = 10
y, m, d = launch.split("-")
start = datetime.date(int(y), int(m), int(d))
back = start + datetime.timedelta(days)
fmt = "%A %d %B %Y"
print("Launch:", start.strftime(fmt))
print("Return:", back.strftime(fmt))
print("Weekend:", "yes" if back.strftime("%A") in ("Saturday", "Sunday") else "no")
print("To new year:", (datetime.date(start.year + 1, 1, 1) - start).days)
