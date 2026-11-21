```py
import math
import random
from collections import Counter
from datetime import date, timedelta

seed = 5
start = "2031-05-14"
nave = ["Speranta", "Fulger", "Bob"]
distante = [7000, 3000, 9500]

random.seed(seed)
ordine = random.sample(nave, len(nave))
distanta = dict(zip(nave, distante))
prima_zi = date.fromisoformat(start)

ore = []
for i, nava in enumerate(ordine):
    zi = prima_zi + timedelta(days=i)
    zbor = math.ceil(distanta[nava] / 3000)
    ore.append(zbor)
    print(f"{zi.strftime('%d %b')}: {nava}, {zbor} h")

print(f"Total: {sum(ore)} h")
cel_mai_des, numar = Counter(ore).most_common(1)[0]
print(f"Cel mai des: {cel_mai_des} h, {numar}")
```
