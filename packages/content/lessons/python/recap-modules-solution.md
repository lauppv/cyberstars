```py
import math
import random
from collections import Counter
from datetime import date, timedelta

seed = 5
start = "2031-05-14"
ships = ["Hope", "Swift", "Bob"]
distances = [7000, 3000, 9500]

random.seed(seed)
order = random.sample(ships, len(ships))
distance_of = dict(zip(ships, distances))
first_day = date.fromisoformat(start)

hours = []
for i, ship in enumerate(order):
    day = first_day + timedelta(days=i)
    flight = math.ceil(distance_of[ship] / 3000)
    hours.append(flight)
    print(f"{day.strftime('%d %b')}: {ship}, {flight} h")

print(f"Total: {sum(hours)} h")
common, count = Counter(hours).most_common(1)[0]
print(f"Most common: {common} h, {count}")
```
