import random
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
    flight = (distance_of[ship] + 2999) // 3000
    hours.append(flight)
    print(f"{day.strftime('%d %b')}: {ship}, {flight} h")

print(f"Total: {sum(hours)} h")
times = {}
for h in hours:
    times[h] = times.get(h, 0) + 1
common = max(times, key=lambda h: times[h])
print(f"Most common: {common} h, {times[common]}")
