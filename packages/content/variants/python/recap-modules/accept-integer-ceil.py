from math import ceil
from random import seed as set_seed, sample
from collections import Counter
from datetime import date, timedelta

seed = 5
start = "2031-05-14"
ships = ["Hope", "Swift", "Bob"]
distances = [7000, 3000, 9500]
set_seed(seed)
order = sample(ships, len(ships))
km = {s: d for s, d in zip(ships, distances)}
first = date.fromisoformat(start)
hours = [ceil(km[s] / 3000) for s in order]
for i, (s, h) in enumerate(zip(order, hours)):
    print(f"{first + timedelta(days=i):%d %b}: {s}, {h} h")
print(f"Total: {sum(hours)} h")
counts = Counter(hours)
top = max(counts.values())
print(f"Most common: {next(h for h in hours if counts[h] == top)} h, {top}")
