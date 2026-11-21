import math
import random
import collections
import datetime

seed = 5
start = "2031-05-14"
ships = ["Hope", "Swift", "Bob"]
distances = [7000, 3000, 9500]
random.seed(seed)
order = random.sample(ships, len(ships))
day = datetime.date.fromisoformat(start)
all_hours = []
for ship in order:
    h = math.ceil(distances[ships.index(ship)] / 3000)
    all_hours.append(h)
    print(day.strftime("%d %b") + ": " + ship + ", " + str(h) + " h")
    day = day + datetime.timedelta(days=1)
print("Total: " + str(sum(all_hours)) + " h")
best = collections.Counter(all_hours).most_common(1)[0]
print("Most common: " + str(best[0]) + " h, " + str(best[1]))
