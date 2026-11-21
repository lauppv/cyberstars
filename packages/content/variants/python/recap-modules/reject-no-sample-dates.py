import calendar
import math
import random
from collections import Counter

seed = 5
start = "2031-05-14"
ships = ["Hope", "Swift", "Bob"]
distances = [7000, 3000, 9500]

random.seed(seed)
pool = list(ships)
order = []
for i in range(len(ships)):
    j = random.randrange(len(ships) - i)
    order.append(pool[j])
    pool[j] = pool[len(ships) - i - 1]
distance_of = dict(zip(ships, distances))
year, month, day = [int(part) for part in start.split("-")]

hours = []
for ship in order:
    flight = math.ceil(distance_of[ship] / 3000)
    hours.append(flight)
    print(f"{day:02d} {calendar.month_abbr[month]}: {ship}, {flight} h")
    day += 1
    if day > calendar.monthrange(year, month)[1]:
        day = 1
        month += 1
        if month > 12:
            month = 1
            year += 1

print(f"Total: {sum(hours)} h")
common, count = Counter(hours).most_common(1)[0]
print(f"Most common: {common} h, {count}")
