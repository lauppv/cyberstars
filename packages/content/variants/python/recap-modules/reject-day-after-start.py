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
km = dict(zip(ships, distances))
first = date.fromisoformat(start)
hours = []
for i, ship in enumerate(order, 1):
    h = math.ceil(km[ship] / 3000)
    hours.append(h)
    print(f"{(first + timedelta(days=i)).strftime('%d %b')}: {ship}, {h} h")
print(f"Total: {sum(hours)} h")
h, n = Counter(hours).most_common(1)[0]
print(f"Most common: {h} h, {n}")
