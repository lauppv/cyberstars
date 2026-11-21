```py
from datetime import date, timedelta

lansare = "2031-05-14"
zile = 10

start = date.fromisoformat(lansare)
inapoi = start + timedelta(days=zile)

print(f"Lansare: {start.strftime('%A %d %B %Y')}")
print(f"Intoarcere: {inapoi.strftime('%A %d %B %Y')}")
print(f"Weekend: {'da' if inapoi.weekday() >= 5 else 'nu'}")
print(f"Pana la anul nou: {(date(start.year + 1, 1, 1) - start).days}")
```
